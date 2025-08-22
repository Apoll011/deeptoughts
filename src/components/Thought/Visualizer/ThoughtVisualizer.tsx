import {ChevronLeft, MapPin, Tag, Folder, Pencil} from "lucide-react";
import type {Thought} from "../../../models/types.ts";
import {ThoughtBlockRenderer} from "./ThoughBlockRenderer.tsx";
import React, {useEffect, useState} from "react";
import ThoughtEditor from "../Editor/ThoughtEditor.tsx";
import type {ThoughtManager} from "../../../core/ThoughtManager.ts";


export const ThoughtVisualizer: React.FC<{thoughtId: string, onBack:  React.MouseEventHandler<HTMLButtonElement>, manager: ThoughtManager, showEdit: boolean}> = ({thoughtId, onBack, manager, showEdit = true}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [thought, setThought] = useState<Thought | null>(null);


    const refreshThought = () => {
        const currentThought = manager.getThought(thoughtId);
        if (!currentThought) {
            console.error(`Thought with ID ${thoughtId} not found.`);
            return;
        }
        setThought(currentThought);
    };

    useEffect(() => {
        refreshThought();
    }, [thoughtId, manager]);

    if (!thought) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (isEdit && showEdit) {
        return (
            <ThoughtEditor backAction={() => { refreshThought(); setIsEdit(false);}} thoughtId={thoughtId} manager={manager} />
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                { showEdit && (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="w-[30%] justify-center inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-1 py-1.5 rounded-md border border-gray-200 transition-all duration-200 font-medium"
                    >
                        <Pencil className="w-4 h-4" />
                        <span className={"font-bold text-sm"}>Edit</span>
                    </button>
                )}
            </div>
            <div className="px-6 pb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {thought.title}
                </h1>

                <div className="flex items-center space-x-3 mb-4 text-sm text-gray-500">
                    <span>{thought.createdAt.toLocaleDateString()}</span>
                    {thought.location && (
                        <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{thought.location}</span>
                            </div>
                        </>
                    )}
                    {thought.weather && (
                        <>
                            <span>•</span>
                            <span>{thought.weather}</span>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {thought.category && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                            <Folder className="w-3.5 h-3.5" />
                            <span>{thought.category}</span>
                        </div>
                    )}
                    {thought.tags && thought.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                            {thought.tags.map((tag, index) => (
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
                    {thought.blocks
                        .sort((a, b) => a.position - b.position)
                        .map(block => (
                            <ThoughtBlockRenderer key={block.id} block={block} showTimestamp={true} />
                        ))}
                </div>
            </div>
        </div>
    );
}