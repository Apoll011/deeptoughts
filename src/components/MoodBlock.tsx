import React, {useState} from "react";
import type {MoodInfo} from "../types.ts";

interface MoodBlockProps {
    mood: MoodInfo;
    className?: string;
}

export const MoodBlock: React.FC<MoodBlockProps> = ({ mood, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getIntensityColor = (intensity: number): string => {
        if (intensity <= 3) return 'from-green-50 to-emerald-50 border-green-100';
        if (intensity <= 6) return 'from-yellow-50 to-orange-50 border-yellow-100';
        return 'from-red-50 to-pink-50 border-red-100';
    };

    const getIntensityTextColor = (intensity: number): string => {
        if (intensity <= 3) return 'text-green-600';
        if (intensity <= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getEnergyColor = (energy?: string): string => {
        switch (energy) {
            case 'low': return 'bg-blue-100 text-blue-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'high': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const intensityBars = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className={`rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${getIntensityColor(mood.intensity)} border ${className}`}>
            {/* Header */}
            <div className="p-4 bg-white bg-opacity-70 backdrop-blur-sm border-b border-opacity-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: mood.color || '#6B7280' }}
                        >
                            {mood.emoji || '😊'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 capitalize">{mood.primary}</h3>
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${getIntensityTextColor(mood.intensity)}`}>
                                    Intensity: {mood.intensity}/10
                                </span>
                                {mood.energy && (
                                    <span className={`px-2 py-1 text-xs rounded-full ${getEnergyColor(mood.energy)}`}>
                                        {mood.energy} energy
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                {/* Intensity Bar */}
                <div className="mb-4">
                    <div className="flex space-x-1 mb-2">
                        {intensityBars.map((bar) => (
                            <div
                                key={bar}
                                className={`h-2 flex-1 rounded-full ${
                                    bar <= mood.intensity
                                        ? 'bg-current opacity-80'
                                        : 'bg-gray-200'
                                }`}
                                style={{
                                    color: mood.color || '#6B7280',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {mood.note && (
                    <p className="text-sm text-gray-700 mb-3 italic">"{mood.note}"</p>
                )}

                {isExpanded && (
                    <div className="space-y-3">
                        {mood.secondary && mood.secondary.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Secondary Feelings
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {mood.secondary.map((feeling, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-white bg-opacity-70 text-gray-700 text-sm rounded-full"
                                        >
                                            {feeling}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mood.tags && mood.tags.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {mood.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-white bg-opacity-50 text-gray-600 text-xs rounded border"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};