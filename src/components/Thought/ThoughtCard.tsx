import React, {useEffect, useState} from "react";
import type {MediaAttachment, Thought} from "../../models/types.ts";
import {Heart, MapPin, Mic, Share, Tag} from "lucide-react";
import {useAppContext} from "../../context/AppContext.tsx";
import {validateMediaBlock} from "../../core/url-validator.ts";

const hashString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
};

export const ThoughtCard: React.FC<{
    thought: Thought;
    onSelect: (thought: Thought) => void;
    compact?: boolean;
}> = ({ thought, onSelect, compact = false }) => {
    const { manager } = useAppContext();
    const [firstImage, setFirtImage] = useState<MediaAttachment | undefined>();
    const hasAudio = thought.blocks.some(block => block.media?.type === 'audio');
    const [frameSrc, setFrameSrc] = useState<string | null>(null);
    const [isLoadingFrame, setIsLoadingFrame] = useState<boolean>(false);
    const [frameError, setFrameError] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState(thought.isFavorite);
    const [isAnimating, setIsAnimating] = useState(false);

    const extractRandomFrame = (videoUrl: string | undefined) => {
        if (!videoUrl) {
            setFrameError(true);
            return;
        }

        setIsLoadingFrame(true);
        setFrameError(false);

        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous";

        const timeoutId = setTimeout(() => {
            setFrameError(true);
            setIsLoadingFrame(false);
        }, 5000);

        video.onloadedmetadata = () => {
            try {
                video.currentTime = Math.random() * video.duration;
            } catch (error) {
                console.error("Error setting video time:", error);
                setFrameError(true);
                setIsLoadingFrame(false);
                clearTimeout(timeoutId);
            }
        };

        video.onseeked = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext("2d");
                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const frameDataUrl = canvas.toDataURL("image/png");
                    setFrameSrc(frameDataUrl);
                    setIsLoadingFrame(false);
                } else {
                    throw new Error("Could not get canvas context");
                }
            } catch (error) {
                console.error("Error extracting video frame:", error);
                setFrameError(true);
                setIsLoadingFrame(false);
            }
            clearTimeout(timeoutId);
        };

        video.onerror = () => {
            console.error("Error loading video.");
            setFrameError(true);
            setIsLoadingFrame(false);
            clearTimeout(timeoutId);
        };

        video.onload = () => {
            if (video.readyState >= 2) {
                try {
                    video.currentTime = Math.random() * video.duration;
                } catch (error) {
                    console.error("Error in onload:", error);
                    setFrameError(true);
                    setIsLoadingFrame(false);
                    clearTimeout(timeoutId);
                }
            }
        };
    };

    useEffect(() => {
        const media = thought.blocks.find(block => block.media?.type === 'video');
        if (media && media.media) {
            validateMediaBlock(media).then((newBlock) => {
                const url: string | undefined = media.media.url;
                extractRandomFrame(url);
            });
        }
    }, [thought.id]);

    useEffect(() => {
        setIsFavorite(thought.isFavorite);
    }, [thought.isFavorite]);

    useEffect(() => {
        const media = thought.blocks.find(block => block.media?.type === 'image');
        if (media) {
            console.log("Validating media block for image:", media);
            validateMediaBlock(media).then((newBlock) => {
                setFirtImage(newBlock.media || undefined);
            });
        }

        else if (frameSrc) {
            setFirtImage({
                caption: "Video frame",
                id: "video-frame",
                type: "image",
                url: frameSrc
            });
        }
        else if (!isLoadingFrame || frameError) {
            const hash = hashString(thought.title);
            setFirtImage({
                caption: "Generated image",
                id: "generated",
                type: "image",
                url: `https://picsum.photos/seed/${hash}/400/300`
            });
        }
    }, [thought.id]);

    if (compact) {
        return (
            <div
                className="group bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-200 hover:bg-white"
                onClick={() => onSelect(thought)}
            >
                <div className="p-3.5 flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 transition-colors duration-300`}>
                            <span className="text-lg transform transition-transform duration-300 scale-120 group-hover:scale-140">
                                {thought.primaryEmotion}
                            </span>
                        </div>
                        {thought.isFavorite && (
                            <div className="absolute -top-1.5 -right-1.5 bg-rose-500 rounded-full p-1">
                                <Heart className="w-4 h-4 text-white fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                                {thought.title}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {thought.blocks.find(block => block.type === 'text')?.content || ''}
                        </p>

                        <div className="flex items-center space-x-3">
                            <time className="text-xs font-medium text-gray-500">
                                {thought.createdAt.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </time>

                            {thought.category && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${
                                    thought.category === 'Family'
                                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-700/10'
                                        : thought.category === 'Nature'
                                            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10'
                                            : 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
                                }`}>
                                {thought.category}
                            </span>
                            )}

                            {hasAudio && (
                                <span className="flex items-center bg-purple-100 text-purple-600 rounded-full p-1">
                                    <Mic className="w-3 h-3" />
                                </span>
                            )}
                        </div>
                    </div>

                    {firstImage && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                            {isLoadingFrame ? (
                                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-gray-300/50 border-t-gray-400 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="w-full h-full relative group">
                                    <img
                                        src={firstImage.url}
                                        alt=""
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-[1.02]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={(e) => {
                if (e.target instanceof Element &&
                    (e.target.closest('.share-button') || e.target.closest('.heart-button'))) {
                    e.stopPropagation();
                    return;
                }
                onSelect(thought);
            }}
        >
            {firstImage && (
                <div className="h-52 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 relative overflow-hidden">
                    {isLoadingFrame ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <img
                            src={firstImage.url}
                            alt={firstImage.caption}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const hash = hashString(thought.title);
                                target.src = `https://picsum.photos/seed/${hash}/800/600`;
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <span className="text-2xl">{thought.primaryEmotion}</span>
                    </div>
                </div>
            )}

            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 mr-2">
                        {thought.title}
                    </h3>
                    {!firstImage && (
                        <div className="flex items-center space-x-2">
                            {thought.isFavorite && (
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                            )}
                            <span className="text-3xl">{thought.primaryEmotion}</span>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {thought.blocks.find(block => block.type === 'text')?.content}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {thought.createdAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                          })}
                        </span>
                        {thought.location && (
                            <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">{thought.location}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {thought.category && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${
                                thought.category === 'Family'
                                    ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-700/10'
                                    : thought.category === 'Nature'
                                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10'
                                        : 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
                            }`}>
                                {thought.category}
                            </span>
                        )}
                        {hasAudio && (
                            <div className="bg-purple-100 rounded-full p-1.5">
                                <Mic className="w-3 h-3 text-purple-600" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 text-gray-400">
                        <div
                            className={`heart-button ${isFavorite ? 'bg-red-500' : 'hover:bg-gray-100'} 
                            transition-all duration-300 ease-in-out transform 
                            ${isAnimating ? 'scale-125' : 'scale-100'}
                            bg-opacity-90 backdrop-blur-sm rounded-full p-1.5 shadow-lg cursor-pointer`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAnimating(true);
                                manager.toggleFavorite(thought.id);
                                setIsFavorite(!isFavorite);
                                setTimeout(() => setIsAnimating(false), 300);
                            }}
                        >
                            <Heart
                                className={`w-5 h-5 transition-all duration-300 ease-in-out transform
                                ${isFavorite ? 'fill-current text-white scale-110' : 'hover:text-red-500 scale-100'}
                                ${isAnimating ? 'animate-pulse' : ''}`}
                            />
                        </div>
                        <div
                            className="share-button hover:bg-gray-100 transition-colors duration-200 bg-opacity-90 backdrop-blur-sm rounded-full p-1.5 shadow-lg cursor-pointer`"
                            onClick={(e) => {
                                e.stopPropagation();
                                manager.shareThought(thought.id);
                            }}
                        >
                            <Share className="w-5 h-5 hover:text-blue-500" />
                        </div>
                    </div>
                </div>

                {thought.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {thought.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                                <Tag className="w-2.5 h-2.5" />
                                <span>{tag}</span>
                            </span>
                        ))}
                        {thought.tags.length > 3 && (
                            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">+{thought.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};