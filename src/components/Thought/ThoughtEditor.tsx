import React, {useRef, useState} from 'react';
import {
    Eye,
    Plus,
    Type,
    X,
} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {ThoughtVisualizer} from "./ThoughtVisualizer.tsx";
import {ToolBar} from "./ToolBar.tsx";
import type {blockType, mediaType, Thought, ThoughtBlock} from "../../types.ts";
import ThoughtBlocks from "./ThougthsBlockWidget.tsx";

const categories = ['Personal', 'Work', 'Travel', 'Relationships', 'Goals', 'Reflections', 'Dreams', 'Memories'];

export default function ThoughtEditor() {
    const [isPreview, setIsPreview] = useState(false);
    const [thought, setThought] = useState<Thought>({
        id: uuidv4(),
        title: '',
        blocks: [],
        primaryEmotion: '',
        tags: [],
        category: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        mood: 'calm',
        weather: '',
        location: ''
    });

    const [newTag, setNewTag] = useState('');

    const content = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        content.current?.scrollIntoView({ behavior: "smooth" })
    }

    const addBlock = (type: blockType, subType: mediaType | null = null ) => {
        const newBlock: ThoughtBlock = {
            id: uuidv4(),
            type,
            content: '',
            position: thought.blocks.length,
            timestamp: new Date()
        };

        if (type === 'mood') {
            newBlock.mood = {
                id: uuidv4(),
                primary: 'content',
                intensity: 5,
                secondary: [],
                energy: 'medium',
                emoji: '😊',
                color: '#10B981',
                note: ''
            };
        } else if (type === 'location') {
            newBlock.location = {
                id: uuidv4(),
                name: '',
                coordinates: { lat: 0, lng: 0 },
                address: '',
                city: '',
                country: '',
                timezone: '',
                weather: {
                    condition: 'clear',
                    temperature: 20,
                    icon: '☀️'
                }
            };
        } else if (type === 'media') {
            newBlock.media = {
                id: uuidv4(),
                type: subType ? subType : 'image',
                url: '',
                caption: ''
            };
        }

        setThought(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
            updatedAt: new Date()
        }));

        scrollToBottom();
    };

    // @ts-ignore
    const updateBlock = (blockId: string, updates) => {
        setThought(prev => ({
            ...prev,
            blocks: prev.blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
            ),
            updatedAt: new Date()
        }));
    };

    const deleteBlock = (blockId: string) => {
        setThought(prev => ({
            ...prev,
            blocks: prev.blocks.filter(block => block.id !== blockId),
            updatedAt: new Date()
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !thought.tags.includes(newTag.trim())) {
            setThought(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setThought(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleFileUpload = (blockId: string, file: File) => {
        if (file) {
            const url = URL.createObjectURL(file);
            const fileType = file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' : 'audio';

            updateBlock(blockId, {
                media: {
                    id: uuidv4(),
                    type: fileType,
                    url: url,
                    caption: ''
                }
            });
        }
    };

    const addSecondaryMood = (blockId: string, mood: string) => {
        const block = thought.blocks.find(b => b.id === blockId);
        if (block && block.mood) {
            const current = block.mood.secondary || [];
            if (!current.includes(mood)) {
                updateBlock(blockId, {
                    mood: { ...block.mood, secondary: [...current, mood] }
                });
            }
        }
    };

    const removeSecondaryMood = (blockId: string, moodToRemove: string) => {
        const block = thought.blocks.find(b => b.id === blockId);
        if (block && block.mood) {
            updateBlock(blockId, {
                mood: {
                    ...block.mood,
                    secondary: (block.mood.secondary || []).filter(m => m !== moodToRemove)
                }
            });
        }
    };

    if (isPreview) {
        return (
            <ThoughtVisualizer selectedThought={thought} onBack={() => setIsPreview(false)} />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
            <div className="max-w-5xl mx-auto p-6" >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <button
                            onClick={() => setIsPreview(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Eye className="w-5 h-5" />
                            <span className="font-medium">Preview</span>
                        </button>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                            <Type className="w-4 h-4" />
                            <span>Title</span>
                        </label>
                        <input
                            type="text"
                            value={thought.title}
                            onChange={(e) => setThought(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="What's flowing through your mind?"
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 text-lg placeholder-gray-400 bg-gray-50/50"
                        />
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="block text-sm font-semibold text-gray-700">Category</label>
                        <select
                            value={thought.category}
                            onChange={(e) => setThought(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                        >
                            <option value="">Select category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {thought.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 hover:text-purple-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                placeholder="Add a descriptive tag"
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                            />
                            <button
                                onClick={addTag}
                                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <ThoughtBlocks blocks={thought.blocks} onDeleteBlock={deleteBlock} onUpdateBlock={updateBlock} onAddSecondaryMood={addSecondaryMood} onRemoveSecondaryMood={removeSecondaryMood} onFileUpload={handleFileUpload} onUseCurrentLocation={() => {}} />

                <ToolBar add={addBlock} />
            </div>
        </div>
    );
}
