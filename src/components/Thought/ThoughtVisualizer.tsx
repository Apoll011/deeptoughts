import {ChevronLeft, MapPin} from "lucide-react";
import type {Thought} from "../../types.ts";
import {ThoughtBlockRenderer} from "./ThoughBlockRenderer.tsx";
import React from "react";


export const ThoughtVisualizer: React.FC<{selectedThought: Thought, onBack:  React.MouseEventHandler<HTMLButtonElement>}> = ({selectedThought, onBack}) => {
    return (
        <div className="bg-white min-h-screen">
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

                <div className="flex items-center space-x-3 mb-6 text-sm text-gray-500">
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

                <div className="space-y-4">
                    {selectedThought.blocks
                        .sort((a, b) => a.position - b.position)
                        .map(block => (
                            <ThoughtBlockRenderer block={block} showTimestamp={true} />
                        ))}
                </div>
            </div>
        </div>
    );
}