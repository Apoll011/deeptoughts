import React, { useState, useRef, useEffect, useCallback } from "react";
import { Pause, Play, Volume2, Volume1, VolumeX, SkipBack, SkipForward, Settings } from "lucide-react";
import type { MediaAttachment } from "../../../../models/types.ts";

export const AudioPlayer: React.FC<{ media: MediaAttachment }> = ({ media }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [waveform, setWaveform] = useState<number[]>([]);
    const [isWaveformLoading, setIsWaveformLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const playbackRef = useRef<HTMLDivElement>(null);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (!isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);

        const handleLoadedMetadata = () => {
            updateDuration();

            if (waveform.length === 0 && !isWaveformLoading) {
                console.log("Audio duration loaded:", audio.duration);
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('durationchange', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [waveform.length, isWaveformLoading]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // Generate waveform data from audio file
    useEffect(() => {
        if (media.url) {
            setIsWaveformLoading(true);

            const generateWaveform = async () => {
                try {
                    // @ts-ignore
                    const audioContext = new (window.AudioContext || (window as unknown).webkitAudioContext)();

                    const response = await fetch(media.url);
                    const arrayBuffer = await response.arrayBuffer();

                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    const channelData = audioBuffer.getChannelData(0); // Use the first channel

                    const numberOfSamples = 50;
                    const blockSize = Math.floor(channelData.length / numberOfSamples);

                    const waveformData = [];

                    for (let i = 0; i < numberOfSamples; i++) {
                        const blockStart = blockSize * i;
                        let sum = 0;

                        for (let j = 0; j < blockSize; j++) {
                            sum += Math.abs(channelData[blockStart + j]);
                        }

                        const average = sum / blockSize;
                        waveformData.push(average);
                    }

                    const maxValue = Math.max(...waveformData);
                    const normalizedData = waveformData.map(value => value / maxValue);

                    setWaveform(normalizedData);

                    setDuration(audioBuffer.duration);

                    setIsWaveformLoading(false);
                } catch (error) {
                    console.error("Error generating waveform:", error);
                    setIsWaveformLoading(false);
                    setWaveform(Array(50).fill(0.5));
                }
            };

            generateWaveform();
        }
    }, [media.url]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const progressRect = progressRef.current.getBoundingClientRect();
            const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
            const seekTime = seekPosition * duration;

            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                Math.max(audioRef.current.currentTime + seconds, 0),
                duration
            );
        }
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="w-5 h-5 text-gray-600"/>;
        if (volume < 0.5) return <Volume1 className="w-5 h-5 text-gray-600"/>;
        return <Volume2 className="w-5 h-5 text-gray-600"/>;
    };

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
            setShowVolumeSlider(false);
        }
        if (playbackRef.current && !playbackRef.current.contains(e.target as Node)) {
            setShowPlaybackOptions(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    if (isWaveformLoading) {
        return (
            <div className="w-full h-48 bg-white rounded-2xl p-6 my-5 shadow-xl w-full border border-gray-200 transition-all duration-300 hover:shadow-2xl flex items-center justify-center">
                <div className="text-center text-gray-300">
                    <div className="w-12 h-12 border-4 border-gray border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm">Loading...</p>
                </div>
            </div>
        )
    };

    if (duration == 0) { //TODO: change it to on error or something
        return (
            <div className="w-full h-48 bg-white rounded-2xl p-6 my-5 shadow-xl w-full border border-gray-200 transition-all duration-300 hover:shadow-2xl flex items-center justify-center">
                <div className="text-center text-gray-300">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16.5858V7.41421C12 6.52331 10.9229 6.07714 10.2929 6.70711L8.29289 8.70711C8.10536 8.89464 7.851 9 7.58579 9H6C5.44772 9 5 9.44772 5 10V14C5 14.5523 5.44772 15 6 15H7.58579C7.851 15 8.10536 15.1054 8.29289 15.2929L10.2929 17.2929C10.9229 17.9229 12 17.4767 12 16.5858Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M16.5361 13.5353V8" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M17.5361 16.598C17.5361 17.1503 17.0884 17.598 16.5361 17.598C15.9838 17.598 15.5361 17.1503 15.5361 16.598C15.5361 16.0457 15.9838 15.598 16.5361 15.598C17.0884 15.598 17.5361 16.0457 17.5361 16.598Z" fill="#000000"></path> </g></svg>
                    <p className="text-sm">Failed to load Audio</p>
                </div>
            </div>
        )
    };
    return (
        <div 
            ref={playerRef}
            className="bg-white rounded-2xl p-6 my-5 shadow-xl w-full border border-gray-200 transition-all duration-300 hover:shadow-2xl"
            style={{
                boxShadow: isHovering ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <audio ref={audioRef} src={media.url} preload="metadata" />

            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{media.caption}</h3>
                <div className="text-xs text-gray-600 opacity-80">
                    {formatTime(duration)} • {playbackRate}x speed
                </div>
            </div>

            <div
                ref={progressRef}
                className="flex items-center justify-center space-x-0.5 h-32 px-2 cursor-pointer mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100"
                onClick={handleSeek}
                style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)' }}
            >
                {isWaveformLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-pulse flex space-x-1">
                            {Array(20).fill(0).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-300 rounded-full"
                                    style={{
                                        height: `${20 + Math.sin(index/3) * 15}%`,
                                        width: '4px',
                                        opacity: 0.7
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    waveform.map((height, index) => {
                        const isActive = index <= (currentTime / duration) * waveform.length;
                        const barHeight = Math.max(height * 100, 5);

                        return (
                            <div
                                key={index}
                                className={`rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'bg-blue-500'
                                        : 'bg-gray-300'
                                }`}
                                style={{
                                    height: `${barHeight}%`,
                                    width: `${100 / waveform.length}%`,
                                    maxWidth: '6px',
                                    minWidth: '3px',
                                    minHeight: '4px',
                                    animation: isPlaying && isActive ? 'waveform-pulse 1s infinite' : 'none'
                                }}
                            />
                        );
                    })
                )}
            </div>

            <div className="flex justify-between text-xs text-gray-700 mb-5 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center mb-6 gap-4">
                <div className="flex items-center space-x-4 sm:space-x-5 mx-auto sm:mx-0">
                    <button 
                        onClick={() => skip(-10)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 sm:p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                        title="Skip back 10 seconds"
                    >
                        <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="bg-blue-500 shadow-lg rounded-full p-5 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        style={{
                            boxShadow: isPlaying 
                                ? '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)' 
                                : '0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                        }}
                    >
                        {isPlaying ? (
                            <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        ) : (
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" />
                        )}
                    </button>

                    <button 
                        onClick={() => skip(10)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 sm:p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                        title="Skip forward 10 seconds"
                    >
                        <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                </div>

                <div className="flex items-center space-x-4 mx-auto sm:mx-0">
                    <div className="relative" ref={playbackRef}>
                        <button 
                            onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors"
                            title="Playback settings"
                        >
                            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        </button>

                        {showPlaybackOptions && (
                            <div className="absolute right-0 bottom-14 bg-white shadow-xl rounded-lg p-3 z-10 w-48 border border-gray-200 animate-fadeIn">
                                <p className="text-xs font-semibold text-gray-800 mb-2">Playback Speed</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3].map(rate => (
                                        <button 
                                            key={rate} 
                                            onClick={() => setPlaybackRate(rate)}
                                            className={`px-2 py-2 text-sm rounded-md transition-all ${
                                                playbackRate === rate 
                                                    ? 'bg-blue-500 text-white font-bold shadow-sm' 
                                                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                            }`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={volumeRef}>
                        <button 
                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors"
                            title="Volume control"
                        >
                            {getVolumeIcon()}
                        </button>

                        {showVolumeSlider && (
                            <div className="absolute right-0 bottom-14 bg-white shadow-xl rounded-lg p-4 z-10 border border-gray-200 animate-fadeIn">
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => setVolume(0)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <VolumeX className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.01" 
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-28 h-2 accent-blue-500"
                                    />
                                    <button 
                                        onClick={() => setVolume(1)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Volume2 className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes waveform-pulse {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; transform: scaleY(1.05); }
                    100% { opacity: 0.9; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};
