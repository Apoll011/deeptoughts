import type {MediaAttachment, ThoughtBlock, mediaType} from "../../../../models/types.ts";
import {Upload, Mic, StopCircle, Camera, Video} from "lucide-react";
import React, {useCallback, useEffect, useRef, useState} from "react";

interface CaptureAudioOptions {
    limit?: number;
    duration?: number;
}

interface CaptureImageOptions {
    limit?: number;
}

interface CaptureVideoOptions {
    duration?: number;
    limit?: number;
    quality?: number;
}

interface MediaFile {
    fullPath: string;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    getFormatData?(successCallback: (data: MediaFileData) => void, errorCallback?: () => void): void;
}

interface MediaFileData {
    bitrate: number;
    codecs: string;
    duration: number;
    height: number;
    width: number;
}

interface CaptureError {
    code: number;
}

declare global {
    interface Window {
        MediaCapture?: {
            captureAudio: (options?: CaptureAudioOptions) => Promise<MediaFile[] | CaptureError>;
            captureImage: (options?: CaptureImageOptions) => Promise<MediaFile[] | CaptureError>;
            captureVideo: (options?: CaptureVideoOptions) => Promise<MediaFile[] | CaptureError>;
        };
    }
}

export function MediaInput({block, onUpdateBlock, onFileUpload}: {
    block: ThoughtBlock,
    onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void,
    onFileUpload: (blockId: string, file: File) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for audio recording
    const [isRecording, setIsRecording] = useState(false);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [recError, setRecError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const hasUrl = !!block.media?.url && block.media.url.trim() !== '';
    const hasNativeCapture = typeof window !== 'undefined' && window.MediaCapture;

    const uploadMediaAndGetUrl = async (file: File, type: mediaType): Promise<string> => {
        const localUrl = URL.createObjectURL(file);
        onUpdateBlock(block.id, { media: { id: block.media?.id || block.id, type, url: localUrl, caption: block.media?.caption } as MediaAttachment });
        try { onFileUpload(block.id, file); } catch (e) { console.warn('onFileUpload failed:', e); }
        return localUrl;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const type: mediaType = (block.media?.type || 'image');
            await uploadMediaAndGetUrl(file, type);
        }
    };

    const captureWithNative = async (mediaType: 'audio' | 'image' | 'video') => {
        if (!hasNativeCapture) return;

        setIsCapturing(true);
        setRecError(null);

        try {
            let result: MediaFile[] | CaptureError;

            switch (mediaType) {
                case 'audio':
                    result = await window.MediaCapture!.captureAudio({
                        limit: 1,
                        duration: 300 // 5 minutes max
                    });
                    break;
                case 'image':
                    result = await window.MediaCapture!.captureImage({
                        limit: 1
                    });
                    break;
                case 'video':
                    result = await window.MediaCapture!.captureVideo({
                        limit: 1,
                        duration: 300, // 5 minutes max
                        quality: 1 // High quality
                    });
                    break;
                default:
                    throw new Error(`Unsupported media type: ${mediaType}`);
            }

            // Check if result is an error
            if ('code' in result) {
                throw new Error(`Capture failed with code: ${result.code}`);
            }

            // Process the captured media files
            const mediaFiles = result as MediaFile[];
            if (mediaFiles.length > 0) {
                const mediaFile = mediaFiles[0];

                // Create a file URL that can be used directly
                const fileUrl = `file://${mediaFile.fullPath}`;

                // Update the block with the native file path
                onUpdateBlock(block.id, {
                    media: {
                        id: block.media?.id || block.id,
                        type: mediaType,
                        url: fileUrl,
                        caption: block.media?.caption
                    } as MediaAttachment
                });
            } else {
                throw new Error('No media files captured');
            }
        } catch (error) {
            console.error(`${mediaType} capture error:`, error);
            setRecError(error instanceof Error ? error.message : `${mediaType} capture failed`);
        } finally {
            setIsCapturing(false);
        }
    };
    const stopVisualization = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        if (audioCtxRef.current) {
            audioCtxRef.current.close().catch(() => {});
            audioCtxRef.current = null;
        }
        analyserRef.current = null;
        dataArrayRef.current = null;
    };

    const getAudioStream = async (): Promise<MediaStream> => {
        if (typeof navigator === 'undefined') {
            throw new Error('Recording is only available in the browser.');
        }
        const navAny = navigator as unknown as {
            mediaDevices?: { getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream> };
            getUserMedia?: (constraints: MediaStreamConstraints, success: (s: MediaStream) => void, error: (e: unknown) => void) => void;
            webkitGetUserMedia?: (constraints: MediaStreamConstraints, success: (s: MediaStream) => void, error: (e: unknown) => void) => void;
            mozGetUserMedia?: (constraints: MediaStreamConstraints, success: (s: MediaStream) => void, error: (e: unknown) => void) => void;
        };

        const modern = navAny.mediaDevices && typeof navAny.mediaDevices.getUserMedia === 'function'
            ? navAny.mediaDevices.getUserMedia.bind(navAny.mediaDevices)
            : undefined;
        const legacy = (navAny.getUserMedia || navAny.webkitGetUserMedia || navAny.mozGetUserMedia);

        if (modern) {
            return modern({ audio: true });
        }
        if (legacy) {
            return new Promise<MediaStream>((resolve, reject) => {
                legacy({ audio: true }, resolve, reject);
            });
        }
        throw new Error('getUserMedia is not supported in this browser or may require HTTPS.');
    };

    const drawWaveform = useCallback(() => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const render = () => {
            if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;
            analyser.getByteTimeDomainData(dataArray);

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath();

            const sliceWidth = WIDTH / dataArray.length;
            let x = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * HEIGHT) / 2;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(WIDTH, HEIGHT / 2);
            ctx.stroke();

            animationRef.current = requestAnimationFrame(render);
        };
        render();
    }, []);

    const startWebRecording = async () => {
        try {
            setRecError(null);
            if (typeof window === 'undefined') {
                setRecError('Recording is only available in the browser.');
                return;
            }
            if (!('MediaRecorder' in window)) {
                setRecError('Recording is not supported in this browser.');
                return;
            }

            const stream = await getAudioStream();
            mediaStreamRef.current = stream;

            const audioCtx = new (window.AudioContext ?? (window as unknown as { webkitAudioContext: { new(): AudioContext } }).webkitAudioContext)();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;
            const bufferLength = analyser.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
            source.connect(analyser);
            drawWaveform();

            const recorder = new MediaRecorder(stream);
            recordedChunksRef.current = [];
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
            };
            recorder.onstop = async () => {
                stopVisualization();
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
                await uploadMediaAndGetUrl(file, 'audio');
            };
            mediaRecorderRef.current = recorder;
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Microphone access error:', err);
            setRecError(err instanceof Error ? err.message : 'Microphone access error');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    useEffect(() => {
        return () => {
            stopVisualization();
            if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
        };
    }, []);

    const renderPreview = () => {
        if (!block.media?.url) return null;
        const t = block.media.type;
        if (t === 'image') {
            return (
                <div className="mt-2">
                    <img src={block.media.url} alt={block.media.caption || 'preview'} className="max-h-64 rounded-lg border border-gray-200 object-contain w-full" />
                </div>
            );
        }
        if (t === 'video') {
            return (
                <div className="mt-2">
                    <video src={block.media.url} controls className="w-full max-h-80 rounded-lg border border-gray-200" />
                </div>
            );
        }
        if (t === 'audio') {
            return (
                <div className="mt-2">
                    <audio src={block.media.url} controls className="w-full" />
                </div>
            );
        }
        return null;
    };

    const showUploader = block.media?.type !== 'audio' && !hasUrl;
    const showUrlInput = block.media?.type !== 'audio' && !hasUrl;

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                        block.media?.type === 'image' ? 'image/*' :
                            block.media?.type === 'video' ? 'video/*' : 'audio/*'
                    }
                    onChange={(e) => handleFileUpload(e)}
                    className="hidden"
                />

                {block.media?.type === 'audio' ? (
                    <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2 text-gray-700">
                                {isRecording ? (
                                    <>
                                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span>Recording...</span>
                                    </>
                                ) : isCapturing ? (
                                    <>
                                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        <span>Opening recorder...</span>
                                    </>
                                ) : (
                                    <span>Record audio</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {hasNativeCapture && !isRecording && !isCapturing && (
                                    <button
                                        onClick={() => captureWithNative('audio')}
                                        className="px-3 py-2 bg-green-500 text-white rounded-md flex items-center space-x-2 hover:bg-green-600"
                                        disabled={isCapturing}
                                    >
                                        <Mic className="w-4 h-4" />
                                        <span>Native</span>
                                    </button>
                                )}
                                {!isRecording && !isCapturing ? (
                                    <button onClick={startWebRecording} className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2 hover:bg-blue-600">
                                        <Mic className="w-4 h-4" />
                                        <span>Web</span>
                                    </button>
                                ) : isRecording ? (
                                    <button onClick={stopRecording} className="px-3 py-2 bg-red-500 text-white rounded-md flex items-center space-x-2 hover:bg-red-600">
                                        <StopCircle className="w-4 h-4" />
                                        <span>Stop</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        {recError && (
                            <div className="mt-2 text-sm text-red-600">
                                {recError}
                            </div>
                        )}

                        {isRecording && (
                            <div className="bg-white rounded-md border border-gray-200 p-2">
                                <canvas ref={canvasRef} height={120} className="w-full" />
                            </div>
                        )}

                        {block.media?.url && (
                            <div className="mt-3">
                                <audio src={block.media.url} controls className="w-full" />
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Native capture buttons for image/video */}
                        {hasNativeCapture && !hasUrl && (
                            <div className="flex space-x-2">
                                {block.media?.type === 'image' && (
                                    <button
                                        onClick={() => captureWithNative('image')}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        disabled={isCapturing}
                                    >
                                        <Camera className="w-4 h-4" />
                                        <span>{isCapturing ? 'Opening...' : 'Take Photo'}</span>
                                    </button>
                                )}
                                {block.media?.type === 'video' && (
                                    <button
                                        onClick={() => captureWithNative('video')}
                                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        disabled={isCapturing}
                                    >
                                        <Video className="w-4 h-4" />
                                        <span>{isCapturing ? 'Opening...' : 'Record Video'}</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Divider between native and upload options */}
                        {hasNativeCapture && showUploader && !hasUrl && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-400">or</span>
                                </div>
                            </div>
                        )}

                        {showUploader && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center space-x-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-gray-500 hover:text-gray-600"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Upload {block.media?.type || 'file'}</span>
                            </button>
                        )}

                        {showUploader && showUrlInput && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-400">or</span>
                                </div>
                            </div>
                        )}

                        {showUrlInput && (
                            <input
                                type="url"
                                value={block.media?.url || ''}
                                onChange={(e) => onUpdateBlock(block.id, {
                                    media: { ...block.media, url: e.target.value } as MediaAttachment
                                })}
                                placeholder="Paste URL"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        )}

                        {renderPreview()}
                    </>
                )}

                {recError && !isRecording && (
                    <div className="mt-2 text-sm text-red-600">
                        {recError}
                    </div>
                )}

                <input
                    type="text"
                    value={block.media?.caption || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        media: { ...block.media, caption: e.target.value } as MediaAttachment
                    })}
                    placeholder="Add a caption..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
        </div>
    );
}