import React from "react";
import type {Thought} from "../types.ts";
import {Heart, MapPin, Mic, Share, Tag} from "lucide-react";

export const ThoughtCard: React.FC<{
    thought: Thought;
    onSelect: (thought: Thought) => void;
    compact?: boolean;
}> = ({ thought, onSelect, compact = false }) => {
    const firstImage = thought.blocks.find(block => block.media?.type === 'image')?.media;
    const hasAudio = thought.blocks.some(block => block.media?.type === 'audio');

    if (compact) {
        return (
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
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

                            <span className={`px-2 py-0.5 rounded-full text-xs ${
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
                        <div className="w-12 h-12 rounded-lg overflow-hidden ml-2 flex-shrink-0">
                            <img
                                src={firstImage.url}
                                alt={firstImage.caption}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => onSelect(thought)}
        >
            {firstImage && (
                <div className="h-48 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 relative overflow-hidden">
                    <img
                        src={firstImage.url}
                        alt={firstImage.caption}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                        <div className={`${thought.isFavorite ? 'bg-red-500' : ''} bg-opacity-90 backdrop-blur-sm rounded-full p-1 shadow-lg`}>
                            <Heart className={`w-6 h-6 ${thought.isFavorite ? 'fill-current text-white' : ''}`} />
                        </div>
                        <Share className="w-6 h-6" />
                    </div>
                </div>

                {thought.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {thought.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                <Tag className="w-2.5 h-2.5" />
                <span>{tag}</span>
              </span>
                        ))}
                        {thought.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{thought.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
