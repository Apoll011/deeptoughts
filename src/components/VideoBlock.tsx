import type {MediaBlockProps} from "../types.ts";
import React, {useState} from "react";

export const VideoBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

    const handleMetadataLoaded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoDuration = event.currentTarget.duration;
        setDuration(videoDuration);
    };

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
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl ${className}`}>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 468.552"><path fill-rule="nonzero" d="M234.279 320.204c-3.085-37.773-8.145-44.093-10.098-68.552-1.966-24.662-3.6-60.342 31.765-60.342 37.063 0 33.94 39.748 31.277 65.224-2.162 20.979-6.85 28.527-9.77 63.67h-43.174zM97.632 0h316.736C468.072 0 512 43.928 512 97.632v273.292c0 53.682-43.95 97.629-97.632 97.629H97.632C43.927 468.553 0 424.629 0 370.924V97.632C0 43.902 43.901 0 97.632 0zm292.767 28.619H284.447l-37.054 94.343h105.793L389.4 30.763c.286-.725.62-1.441.999-2.144zm-130.818 0H150.703l-37.057 94.343h108.69l36.129-91.983c.314-.798.687-1.587 1.116-2.36zm-133.998 0H97.632c-37.929 0-69.013 31.084-69.013 69.013v25.33h59.75l36.215-92.199c.286-.725.62-1.441.999-2.144zM28.619 151.575v219.349c0 37.907 31.106 69.01 69.013 69.01h316.736c37.884 0 69.012-31.126 69.012-69.01V151.575H28.619zm454.761-28.613v-25.33c0-37.461-30.422-68.386-67.867-69.003l-37.051 94.333H483.38zM234.279 344.093h43.174v36.488h-43.174v-36.488z"/></svg>
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
                            onLoadedMetadata={handleMetadataLoaded}
                            onError={handleVideoError}
                            onPlay={handlePlay}
                            onPause={handlePause}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Duration badge */}
                        {duration && !isPlaying && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
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