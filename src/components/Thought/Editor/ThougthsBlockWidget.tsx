import React, {useEffect, useRef} from 'react';
import {
    GripVertical,
    Trash2,
} from 'lucide-react';
import {
    type ThoughtBlock,
} from '../../../models/types.ts';
import {TextInput} from "./Blocks/TextInput.tsx";
import {MediaInput} from "./Blocks/MediaInput.tsx";
import {LocationInput} from "./Blocks/LocationInput.tsx";
import {MoodInput} from "./Blocks/MoodInput.tsx";

interface ThoughtBlocksProps {
    blocks: ThoughtBlock[];
    onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void;
    onDeleteBlock: (id: string) => void;
    onAddSecondaryMood: (blockId: string, mood: string) => void;
    onRemoveSecondaryMood: (blockId: string, mood: string) => void;
    onFileUpload: (blockId: string, file: File) => void;
    onUseCurrentLocation: (blockId: string) => void;
}

const ThoughtBlocks: React.FC<ThoughtBlocksProps> = ({
                                                         blocks,
                                                         onUpdateBlock,
                                                         onDeleteBlock,
                                                         onAddSecondaryMood,
                                                         onRemoveSecondaryMood,
                                                         onFileUpload,
                                                         onUseCurrentLocation
                                                     }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const prevBlocksLength = useRef(blocks.length);





    useEffect(() => {
        if (blocks.length > prevBlocksLength.current && containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
        prevBlocksLength.current = blocks.length;
    }, [blocks.length]);


    return (
        <div ref={containerRef} className="space-y-4">
            {blocks
                .sort((a, b) => a.position - b.position)
                .map((block, index) => (
                    <div
                        key={block.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-gray-300" />
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-600 font-medium">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm text-gray-500 capitalize">
                    {block.type}
                  </span>
                                </div>
                            </div>
                            <button
                                onClick={() => onDeleteBlock(block.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6">
                            {block.type === 'text' && (
                                <TextInput block={block}
                                           onUpdateBlock={onUpdateBlock}/>
                            )}

                            {block.type === 'media' && (
                                <MediaInput block={block} onUpdateBlock={onUpdateBlock} onFileUpload={onFileUpload} />
                            )}

                            {block.type === 'location' && (
                                <LocationInput block={block} onUpdateBlock={onUpdateBlock} onUseCurrentLocation={onUseCurrentLocation} />
                            )}

                            {block.type === 'mood' && (
                                <MoodInput block={block} onUpdateBlock={onUpdateBlock} onAddSecondaryMood={onAddSecondaryMood} onRemoveSecondaryMood={onRemoveSecondaryMood} />
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ThoughtBlocks;