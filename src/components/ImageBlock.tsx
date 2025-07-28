import type {MediaBlockProps} from "../types.ts";
import React, {useState} from "react";

export const ImageBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-white ${className}`}>
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
                    <img
                        src={media.url}
                        alt={media.caption || 'Image'}
                        className="w-full h-auto object-cover"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="lazy"
                    />
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