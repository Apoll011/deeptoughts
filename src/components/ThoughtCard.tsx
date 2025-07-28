import React, {useState, useEffect} from "react";
import type {MediaAttachment, Thought} from "../types.ts";
import {Heart, MapPin, Mic, Share, Tag} from "lucide-react";

// Function to generate a hash from a string
const hashString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
};

// Mock function for sharing that will be implemented later
const shareThought = (thought: Thought) => {
    console.log(`Sharing thought: ${thought.title}`);
    // This is a placeholder for the actual implementation
    alert(`Sharing: ${thought.title}`);
};

export const ThoughtCard: React.FC<{
    thought: Thought;
    onSelect: (thought: Thought) => void;
    compact?: boolean;
}> = ({ thought, onSelect, compact = false }) => {
    let firstImage: MediaAttachment | undefined;
    const hasAudio = thought.blocks.some(block => block.media?.type === 'audio');
    const [frameSrc, setFrameSrc] = useState<string | null>(null);
    const [isLoadingFrame, setIsLoadingFrame] = useState<boolean>(false);
    const [frameError, setFrameError] = useState<boolean>(false);

    const extractRandomFrame = (videoUrl: string | undefined) => {
        if (!videoUrl) {
            setFrameError(true);
            return;
        }

        setIsLoadingFrame(true);
        setFrameError(false);

        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous"; // Ensure CORS is handled if needed

        // Set a timeout to handle cases where the video doesn't load
        const timeoutId = setTimeout(() => {
            setFrameError(true);
            setIsLoadingFrame(false);
        }, 5000); // 5 seconds timeout

        video.onloadedmetadata = () => {
            try {
                const randomTime = Math.random() * video.duration; // Random time within video duration
                video.currentTime = randomTime;
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
                    setFrameSrc(frameDataUrl); // Set the frame as an image source
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

        // Add load event to handle cases where the video loads but doesn't trigger metadata
        video.onload = () => {
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                try {
                    const randomTime = Math.random() * video.duration;
                    video.currentTime = randomTime;
                } catch (error) {
                    console.error("Error in onload:", error);
                    setFrameError(true);
                    setIsLoadingFrame(false);
                    clearTimeout(timeoutId);
                }
            }
        };
    };

    // Use useEffect to handle the asynchronous frame extraction
    useEffect(() => {
        if (thought.blocks.find(block => block.media?.type === 'video')) {
            const url: string | undefined = thought.blocks.find(block => block.media?.type === 'video')?.media.url;
            extractRandomFrame(url);
        }
    }, [thought.id]); // Only re-run if the thought ID changes

    // Find image in thought blocks
    if (thought.blocks.find(block => block.media?.type === 'image')) {
        firstImage = thought.blocks.find(block => block.media?.type === 'image')?.media;
    }
    // Use video frame if available
    else if (frameSrc) {
        firstImage = {
            caption: "Video frame",
            id: "video-frame",
            type: "image",
            url: frameSrc
        };
    }
    // Fallback to a placeholder image based on the thought title hash
    else if (!isLoadingFrame || frameError) {
        const hash = hashString(thought.title);
        firstImage = {
            caption: "Generated image",
            id: "generated",
            type: "image",
            url: `https://picsum.photos/seed/${hash}/400/300`
        };
    }



    if (compact) {
        return (
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                onClick={() => onSelect(thought)}
            >
                <div className="p-3 flex items-center">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                                {thought.title}
                            </h3>
                            <span className="text-lg">{thought.primaryEmotion}</span>
                            {thought.isFavorite && (
                                <Heart className="w-3 h-3 text-red-500 fill-current" />
                            )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                            <span>{thought.createdAt.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</span>

                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                thought.category === 'Family'
                                    ? 'bg-blue-50 text-blue-700'
                                    : thought.category === 'Nature'
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-amber-50 text-amber-700'
                            }`}>
                                {thought.category}
                            </span>

                            {hasAudio && (
                                <Mic className="w-3 h-3 text-purple-600" />
                            )}
                        </div>
                    </div>

                    {firstImage && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden ml-2 flex-shrink-0 shadow-sm">
                            {isLoadingFrame ? (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <img
                                    src={firstImage.url}
                                    alt={firstImage.caption}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        const hash = hashString(thought.title);
                                        target.src = `https://picsum.photos/seed/${hash}/400/300`;
                                    }}
                                />
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
                // Don't trigger onSelect if clicking on share or heart buttons
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
                                // Fallback if image fails to load
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            thought.category === 'Family'
                                ? 'bg-blue-100 text-blue-800'
                                : thought.category === 'Nature'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-amber-100 text-amber-800'
                        }`}>
                          {thought.category}
                        </span>
                        {hasAudio && (
                            <div className="bg-purple-100 rounded-full p-1.5">
                                <Mic className="w-3 h-3 text-purple-600" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 text-gray-400">
                        <div 
                            className={`heart-button ${thought.isFavorite ? 'bg-red-500' : 'hover:bg-gray-100'} transition-colors duration-200 bg-opacity-90 backdrop-blur-sm rounded-full p-1.5 shadow-lg cursor-pointer`}
                            onClick={(e) => {
                                e.stopPropagation();
                                // This would toggle favorite in a real implementation
                                console.log(`Toggle favorite: ${thought.title}`);
                            }}
                        >
                            <Heart className={`w-5 h-5 ${thought.isFavorite ? 'fill-current text-white' : 'hover:text-red-500'}`} />
                        </div>
                        <div 
                            className="share-button hover:bg-gray-100 transition-colors duration-200 rounded-full p-1.5 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                shareThought(thought);
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
