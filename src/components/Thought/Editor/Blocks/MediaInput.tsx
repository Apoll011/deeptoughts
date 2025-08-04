import type {MediaAttachment, ThoughtBlock} from "../../../../models/types.ts";
import {Music, Upload, Video, Image} from "lucide-react";
import React, {useRef} from "react";

export function MediaInput({block, onUpdateBlock, onFileUpload}: { block: ThoughtBlock, onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void, onFileUpload: (blockId: string, file: File) => void}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getMediaIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'audio': return <Music className="w-4 h-4" />;
            default: return <Image className="w-4 h-4" />;
        }
    };

    const handleFileUpload = (blockId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(blockId, file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1 w-fit">
                {(['image', 'video', 'audio'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => onUpdateBlock(block.id, {
                            media: { ...block.media, type } as MediaAttachment
                        })}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                            block.media?.type === type
                                ? 'bg-white text-gray-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {getMediaIcon(type)}
                        <span className="capitalize">{type}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                        block.media?.type === 'image' ? 'image/*' :
                            block.media?.type === 'video' ? 'video/*' : 'audio/*'
                    }
                    onChange={(e) => handleFileUpload(block.id, e)}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-gray-500 hover:text-gray-600"
                >
                    <Upload className="w-4 h-4" />
                    <span>Upload {block.media?.type || 'file'}</span>
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400">or</span>
                    </div>
                </div>

                <input
                    type="url"
                    value={block.media?.url || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        media: { ...block.media, url: e.target.value } as MediaAttachment
                    })}
                    placeholder="Paste URL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />

                <input
                    type="text"
                    value={block.media?.caption || ''}
                    onChange={(e) => onUpdateBlock(block.id, {
                        media: { ...block.media, caption: e.target.value } as MediaAttachment
                    })}
                    placeholder="Add a caption..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
        </div>
    );
}