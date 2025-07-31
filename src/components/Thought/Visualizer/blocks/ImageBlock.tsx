import type {MediaBlockProps} from "../../../../types.ts";
import React, {useState} from "react";
import {FullscreenIcon} from "lucide-react";

export const ImageBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [scale, setScale] = useState(1);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setScale(1); // Reset zoom when toggling fullscreen
    };

    const handleZoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    };

    return (
        <>
            <div className={`group relative rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 ${className}`}>
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {hasError ? (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">Failed to load image</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <img
                                src={media.url}
                                alt="Image"
                                className="w-full h-auto transition-opacity duration-300"
                                style={{ opacity: isLoading ? 0 : 1 }}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                            {media.caption && (
                                <div className="p-4 bg-gray-50 border-t">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {media.caption}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={toggleFullscreen}
                                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                                aria-label="Toggle fullscreen"
                            >
                                <FullscreenIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isFullscreen && !hasError && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={toggleFullscreen}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <img
                            src={media.url}
                            alt="Image"
                            className="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-300"
                            style={{ transform: `scale(${scale})` }}
                        />

                        {media.caption && (
                            <div className="absolute -bottom-8 left-0 right-0 text-white text-center text-sm">
                                {media.caption}
                            </div>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
                            <button
                                onClick={handleZoomOut}
                                className="text-white hover:text-blue-400 transition-colors"
                                aria-label="Zoom out"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="text-white min-w-[3ch] text-center">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={handleZoomIn}
                                className="text-white hover:text-blue-400 transition-colors"
                                aria-label="Zoom in"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            aria-label="Close fullscreen"
                        >
                            <FullscreenIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};