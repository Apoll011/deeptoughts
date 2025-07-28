import type {MediaBlockProps} from "../types.ts";
import React, {useState, useEffect} from "react";

export const VideoBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // Retry loading the video if it fails
    useEffect(() => {
        if (hasError && retryCount < maxRetries) {
            const retryTimer = setTimeout(() => {
                console.log(`Retrying video load (${retryCount + 1}/${maxRetries})...`);
                setHasError(false);
                setIsLoading(true);
                setRetryCount(prev => prev + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff

            return () => clearTimeout(retryTimer);
        }
    }, [hasError, retryCount]);

    const handleMetadataLoaded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        try {
            const videoDuration = event.currentTarget.duration;
            setDuration(videoDuration);
        } catch (error) {
            console.error("Error getting video duration:", error);
        }
    };

    const handleVideoLoad = () => {
        setIsLoading(false);
        setHasError(false);
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
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 ${className}`}>
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                        <div className="text-center text-white">
                            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm font-medium">
                                {retryCount > 0 ? `Retrying (${retryCount}/${maxRetries})...` : 'Loading video...'}
                            </p>
                        </div>
                    </div>
                )}

                {hasError ? (
                    <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center text-gray-300">
                            <div className="bg-gray-700 p-4 rounded-full mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-10 h-10">
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                                </svg>
                            </div>
                            <p className="text-sm font-medium mb-1">Failed to load video</p>
                            {retryCount >= maxRetries && (
                                <p className="text-xs text-gray-400">Please check your connection and try again later</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <video
                            src={media.url}
                            className="w-full h-auto"
                            controls
                            preload="metadata"
                            onLoadedData={handleVideoLoad}
                            onLoadedMetadata={handleMetadataLoaded}
                            onError={handleVideoError}
                            onPlay={handlePlay}
                            onPause={handlePause}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {duration && !isPlaying && (
                            <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-md">
                                {formatDuration(duration)}
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
