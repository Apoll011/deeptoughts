import {useRef, useState} from 'react';
import {
    Eye,
    Plus,
    X,
    Save, ChevronLeft,
} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {ThoughtVisualizer} from "../Visualizer/ThoughtVisualizer.tsx";
import {ToolBar} from "./ToolBar.tsx";
import type {blockType, mediaType, Thought, ThoughtBlock} from "../../../models/types.ts";
import ThoughtBlocks from "./ThougthsBlockWidget.tsx";

const categories = ['Personal', 'Work', 'Travel', 'Relationships', 'Goals', 'Reflections', 'Dreams', 'Memories'];

export default function ThoughtEditor({backAction}: {backAction: () => void}) {
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

    const back = () => {
        backAction();
    }

    if (isPreview) {
        return (
            <ThoughtVisualizer selectedThought={thought} onBack={() => setIsPreview(false)} />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-50 items-center bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <button
                        onClick={back}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-base font-medium text-gray-600">
                        {thought.title ? (thought.title.length > 13 ? thought.title.substring(0, 13).trim() + '...' : thought.title) : 'Untitled thought'}
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => console.log('Saving thought...')}
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 transition-all duration-200 text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 transition-all duration-200 text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                    <div className="px-6 pt-4">
                        <input
                            type="text"
                            value={thought.title}
                            onChange={(e) => setThought(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Note title"
                            className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent mb-2 resize-none"
                        />

                        <div className="flex items-center mb-6">
                            <select
                                value={thought.category}
                                onChange={(e) => setThought(prev => ({ ...prev, category: e.target.value }))}
                                className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <option value="">No Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            {thought.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {thought.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                        {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="ml-1.5 hover:text-blue-900 transition-colors"
                                            >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex w-full items-center space-x-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                    placeholder="Add a descriptive tag"
                                    className="flex-1 min-w-0 h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-gray-50/50"
                                />
                                <button
                                    onClick={addTag}
                                    className="shrink-0 w-12 h-12 inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ThoughtBlocks blocks={thought.blocks} onDeleteBlock={deleteBlock} onUpdateBlock={updateBlock} onAddSecondaryMood={addSecondaryMood} onRemoveSecondaryMood={removeSecondaryMood} onFileUpload={handleFileUpload} onUseCurrentLocation={() => {}} />

                <ToolBar add={addBlock} />
            </div>
        </div>
    );
}
