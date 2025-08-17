import React, { useState, useEffect } from "react";
import type { MoodInfo } from "../../../../models/types.ts";
import { Sparkles, Activity, ChevronsUpDown, Heart, Zap, Cloud, Sun } from "lucide-react";

interface MoodBlockProps {
    mood: MoodInfo;
    className?: string;
}

export const MoodBlock: React.FC<MoodBlockProps> = ({ mood, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animatedIntensity, setAnimatedIntensity] = useState(0);

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => {
                setAnimatedIntensity(mood.intensity);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setAnimatedIntensity(0);
        }
    }, [isExpanded, mood.intensity]);

    const getGradient = (intensity: number): string => {
        if (intensity <= 3) return 'from-green-50 to-emerald-100';
        if (intensity <= 6) return 'from-yellow-50 to-orange-100';
        return 'from-rose-50 to-red-100';
    };

    const getIntensityColor = (intensity: number): string => {
        if (intensity <= 3) return 'text-emerald-600';
        if (intensity <= 6) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getEnergyColor = (energy?: string): string => {
        switch (energy) {
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getEnergyIcon = (energy?: string) => {
        switch (energy) {
            case 'low': return <Cloud className="w-3 h-3" />;
            case 'medium': return <Sun className="w-3 h-3" />;
            case 'high': return <Zap className="w-3 h-3" />;
            default: return <Activity className="w-3 h-3" />;
        }
    };

    const intensityBars = Array.from({ length: 10 }, (_, i) => i + 1);

    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (animatedIntensity / 10) * circumference;

    const getAccentColor = (intensity: number): string => {
        if (intensity <= 3) return '#10b981';
        if (intensity <= 6) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className={`rounded-2xl border border-gray-200 shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300  ${className}`}>
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md border-2"
                            style={{
                                backgroundColor: mood.color || '#6B7280',
                                borderColor: mood.color || '#6B7280'
                            }}
                        >
                            {mood.emoji || '😊'}
                        </div>
                        {mood.intensity >= 8 && (
                            <div className="absolute -top-1 -right-1">
                                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold capitalize text-gray-900">{mood.primary}</h2>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${getIntensityColor(mood.intensity)}`}>
                                {mood.intensity}/10
                            </span>
                            {mood.energy && (
                                <span className={`px-2 py-1 text-xs rounded-full font-medium border flex items-center gap-1 ${getEnergyColor(mood.energy)}`}>
                                    {getEnergyIcon(mood.energy)}
                                    {mood.energy}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                    <ChevronsUpDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <div className={`bg-gradient-to-br ${getGradient(mood.intensity)} transition-all duration-500`}>
                <div className="p-4">
                    {!isExpanded ? (
                        <div className="space-y-3">
                            <div className="flex gap-1">
                                {intensityBars.map((bar) => (
                                    <div
                                        key={bar}
                                        className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                                            bar <= mood.intensity
                                                ? 'opacity-90 shadow-sm'
                                                : 'bg-white/50'
                                        }`}
                                        style={{
                                            backgroundColor: bar <= mood.intensity ? (mood.color || '#6B7280') : undefined,
                                            animationDelay: `${bar * 50}ms`
                                        }}
                                    />
                                ))}
                            </div>

                            {mood.note && (
                                <p className="italic text-gray-700 text-sm leading-relaxed">
                                    "{mood.note}"
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeWidth="6"
                                            fill="none"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke={getAccentColor(mood.intensity)}
                                            strokeWidth="6"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            className="transition-all duration-1000 ease-out drop-shadow-sm"
                                        />
                                        {mood.intensity >= 7 && (
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                stroke={getAccentColor(mood.intensity)}
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={strokeDasharray}
                                                strokeDashoffset={strokeDashoffset}
                                                className="transition-all duration-1000 ease-out opacity-50 blur-[1px]"
                                            />
                                        )}
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-4xl mb-1">{mood.emoji || '😊'}</div>
                                        <div className={`text-sm font-bold ${getIntensityColor(mood.intensity)}`}>
                                            {mood.intensity}/10
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mood.note && (
                                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="flex items-start gap-2">
                                        <Heart className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <p className="italic text-gray-800 text-sm leading-relaxed">
                                            "{mood.note}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {mood.secondary && mood.secondary.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Secondary Feelings
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {mood.secondary.map((feeling, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg text-sm shadow-sm border border-white/30 hover:bg-white/90 transition-all duration-200 hover:scale-105 cursor-default"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                <span className="font-medium">{feeling}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    Mood Analysis
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="text-center">
                                        <div className={`font-bold text-lg ${getIntensityColor(mood.intensity)}`}>
                                            {mood.intensity <= 3 ? 'Calm' : mood.intensity <= 6 ? 'Moderate' : 'Intense'}
                                        </div>
                                        <div className="text-gray-600">Level</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-gray-700">
                                            {mood.energy || 'Neutral'}
                                        </div>
                                        <div className="text-gray-600">Energy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};