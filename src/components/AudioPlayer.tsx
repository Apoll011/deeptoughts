import React, {useState} from "react";
import { Pause, Play, Volume2} from "lucide-react";
import type {MediaAttachment} from "../types.ts";

export const AudioPlayer: React.FC<{ media: MediaAttachment }> = ({ media }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime] = useState(0);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 my-3">
            <div className="flex items-center space-x-3 mb-3">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-purple-600" />
                    ) : (
                        <Play className="w-5 h-5 text-purple-600 ml-0.5" />
                    )}
                </button>
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{media.caption}</div>
                    <div className="text-xs text-gray-500">{formatTime(currentTime)} / {formatTime(media.duration || 0)}</div>
                </div>
                <Volume2 className="w-4 h-4 text-gray-400" />
            </div>

            {/* Waveform visualization */}
            <div className="flex items-center space-x-1 h-8">
                {media.waveform?.map((height, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-t from-purple-400 to-purple-300 rounded-full transition-all duration-200 ${
                            index <= (currentTime / (media.duration || 1)) * media.waveform!.length
                                ? 'opacity-100'
                                : 'opacity-30'
                        }`}
                        style={{
                            height: `${height * 100}%`,
                            width: '3px',
                            minHeight: '4px'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
