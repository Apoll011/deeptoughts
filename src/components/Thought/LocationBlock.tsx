import React, { useState } from "react";
import type { LocationInfo } from "../../types.ts";

interface LocationBlockProps {
    location: LocationInfo;
    className?: string;
}

export const LocationBlock: React.FC<LocationBlockProps> = ({ location, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleMapClick = () => {
        if (location.coordinates) {
            const { lat, lng } = location.coordinates;
            window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
        }
    };

    const handleCopyCoordinates = () => {
        if (location.coordinates) {
            const coordStr = formatCoordinates(location.coordinates);
            navigator.clipboard.writeText(coordStr).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            });
        }
    };

    const formatCoordinates = (coords: { lat: number; lng: number }) => {
        return `${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°`;
    };

    const renderMap = () => {
        const { lat, lng } = location.coordinates!;
        return (
            <div className="mt-3 rounded-xl overflow-hidden border border-blue-100 shadow-sm">
                <iframe
                    width="100%"
                    height="250"
                    className="rounded-xl w-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}>
                </iframe>

            </div>
        );
    };

    const renderLocalTime = () => {
        try {
            const date = new Date().toLocaleString("en-US", { timeZone: location.timezone });
            return date;
        } catch {
            return "Unknown";
        }
    };

    return (
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-2xl transition-all ${className}`}>
            {/* Header */}
            <div className="p-4 bg-white bg-opacity-70 backdrop-blur-sm border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{location.name || "Unknown Location"}</h3>
                            {location.city && location.country && (
                                <p className="text-sm text-gray-600">{location.city}, {location.country}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 text-blue-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {location.weather && (
                    <div className="flex items-center space-x-3 mb-3 p-3 bg-white bg-opacity-50 rounded-lg">
                        <div className="text-2xl">{location.weather.icon || '🌤️'}</div>
                        <div>
                            <p className="font-medium text-gray-800">{location.weather.condition}</p>
                            {location.weather.temperature && (
                                <p className="text-sm text-gray-600">{location.weather.temperature}°C</p>
                            )}
                        </div>
                    </div>
                )}

                {isExpanded && (
                    <div className="space-y-4">
                        {/* Address */}
                        {location.address && (
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-700">{location.address}</p>
                            </div>
                        )}

                        {/* Coordinates */}
                        {location.coordinates && (
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                                </svg>
                                <button onClick={handleMapClick} className="text-sm text-blue-600 underline hover:text-blue-800">
                                    {formatCoordinates(location.coordinates)}
                                </button>
                                <button
                                    onClick={handleCopyCoordinates}
                                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                                    title="Copy to clipboard"
                                >
                                    {copied ? "✅" : "📋"}
                                </button>
                            </div>
                        )}

                        {/* Map */}
                        {location.coordinates && renderMap()}

                        {/* Timezone */}
                        {location.timezone && (
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-700">
                                    {location.timezone} — <span className="font-medium">{renderLocalTime()}</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
