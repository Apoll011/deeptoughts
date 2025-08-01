import {ChevronLeft, MapPin, Tag, Folder} from "lucide-react";
import type {Thought} from "../../../models/types.ts";
import {ThoughtBlockRenderer} from "./ThoughBlockRenderer.tsx";
import React from "react";


export const ThoughtVisualizer: React.FC<{selectedThought: Thought, onBack:  React.MouseEventHandler<HTMLButtonElement>}> = ({selectedThought, onBack}) => {
    return (
        <div className="bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 min-h-screen">
            <div className="p-6">
                <button
                    onClick={onBack}
                    className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedThought.title}
                </h1>

                <div className="flex items-center space-x-3 mb-4 text-sm text-gray-500">
                    <span>{selectedThought.createdAt.toLocaleDateString()}</span>
                    {selectedThought.location && (
                        <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{selectedThought.location}</span>
                            </div>
                        </>
                    )}
                    {selectedThought.weather && (
                        <>
                            <span>•</span>
                            <span>{selectedThought.weather}</span>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {selectedThought.category && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                            <Folder className="w-3.5 h-3.5" />
                            <span>{selectedThought.category}</span>
                        </div>
                    )}
                    {selectedThought.tags && selectedThought.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                            {selectedThought.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {selectedThought.blocks
                        .sort((a, b) => a.position - b.position)
                        .map(block => (
                            <ThoughtBlockRenderer key={block.id} block={block} showTimestamp={true} />
                        ))}
                </div>
            </div>
        </div>
    );
}