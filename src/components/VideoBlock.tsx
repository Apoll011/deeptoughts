import type {MediaBlockProps} from "../types.ts";
import React, {useState} from "react";

export const VideoBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoLoad = () => {
        setIsLoading(false);
    };

    const handleVideoError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const formatDuration = (seconds?: number): string => {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-white ${className}`}>
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                        <div className="text-center text-white">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm">Loading video...</p>
                        </div>
                    </div>
                )}

                {hasError ? (
                    <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-gray-300">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Failed to load video</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <video
                            src={media.url}
                            className="w-full h-auto"
                            controls
                            preload="metadata"
                            onLoadedData={handleVideoLoad}
                            onError={handleVideoError}
                            onPlay={handlePlay}
                            onPause={handlePause}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Duration badge */}
                        {media.duration && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                                {formatDuration(media.duration)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {media.caption && (
                <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {media.caption}
                    </p>
                </div>
            )}
        </div>
    );
};