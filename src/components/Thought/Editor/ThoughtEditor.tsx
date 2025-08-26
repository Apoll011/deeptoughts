import {useRef, useState, useEffect, useMemo} from 'react';
import {
    Plus,
    X,
} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {ToolBar} from "./ToolBar.tsx";
import type {blockType, mediaType, Thought, ThoughtBlock} from "../../../models/types.ts";
import ThoughtBlocks from "./ThougthsBlockWidget.tsx";
import Swal from 'sweetalert2';
import {useAppContext} from "../../../context/AppContext.tsx";

const categories = ['Personal', 'Work', 'Travel', 'Relationships', 'Goals', 'Reflections', 'Dreams', 'Memories'];

export default function ThoughtEditor({backAction, thoughtId}: {backAction: () => void, thoughtId: string}) {
    const { manager } = useAppContext();

    const [newTag, setNewTag] = useState('');
    const [thought, setThought] = useState<Thought | null>(null);
    const [draftThought, setDraftThought] = useState<Thought | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [wordList, setWordList] = useState<string[]>([]);
    const haveToHaveABlockForHeader = false;

    useMemo(() => {
          setWordList(manager.allTags().map(tag => tag.toLowerCase()));
    }, [manager]);

    useEffect(() => {
        if (newTag.length > 0) {
            const suggestions = wordList.filter(word =>
                word.toLowerCase().startsWith(newTag.toLowerCase())
            );
            setFilteredSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    }, [newTag, wordList]);

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    const content = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const refreshThought = () => {
        const currentThought = manager.getThought(thoughtId);
        if (!currentThought) {
            console.error(`Thought with ID ${thoughtId} not found.`);
            return;
        }
        setThought(currentThought);
        setDraftThought(JSON.parse(JSON.stringify(currentThought)));
        setIsDirty(false);
    };

    useEffect(() => {
        refreshThought();
    }, [thoughtId, manager]);

    if (!thought || !draftThought) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            content.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const addBlock = (type: blockType, subType: mediaType | null = null) => {
        const newBlock: ThoughtBlock = {
            id: uuidv4(),
            type,
            content: '',
            position: draftThought.blocks.length,
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

        setDraftThought({...draftThought, blocks: [...draftThought.blocks, newBlock]});
        setIsDirty(true);
        scrollToBottom();
    };

    const updateBlock = (blockId: string, updates: Partial<ThoughtBlock>) => {
        setDraftThought({
            ...draftThought,
            blocks: draftThought.blocks.map(b => b.id === blockId ? {...b, ...updates} : b)
        });
        setIsDirty(true);
    };

    const deleteBlock = (blockId: string) => {
        setDraftThought({
            ...draftThought,
            blocks: draftThought.blocks.filter(b => b.id !== blockId)
        });
        setIsDirty(true);
    };

    const addTag = () => {
        if (newTag.trim() && !draftThought.tags.includes(newTag.trim())) {
            setDraftThought({
                ...draftThought,
                tags: [...draftThought.tags, newTag.trim()]
            });
            setNewTag('');
            setIsDirty(true);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setDraftThought({
            ...draftThought,
            tags: draftThought.tags.filter(tag => tag !== tagToRemove)
        });
        setIsDirty(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setDraftThought({
            ...draftThought,
            tags: [...draftThought.tags, suggestion.trim()]
        });
        setNewTag('');
        setShowSuggestions(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraftThought({ ...draftThought, title: e.target.value });
        setIsDirty(true);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDraftThought({ ...draftThought, category: e.target.value });
        setIsDirty(true);
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
        const block = draftThought.blocks.find(b => b.id === blockId);
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
        const block = draftThought.blocks.find(b => b.id === blockId);
        if (block && block.mood) {
            updateBlock(blockId, {
                mood: {
                    ...block.mood,
                    secondary: (block.mood.secondary || []).filter(m => m !== moodToRemove)
                }
            });
        }
    };

    const isEmptyThought = (t: Thought | null): boolean => {
        if (!t) return true;
        const titleEmpty = !t.title || t.title.trim() === '';
        const noBlocks = !t.blocks || t.blocks.length === 0;
        return titleEmpty && noBlocks;
    };

    const handleSave = () => {
        if (!draftThought) return;

        if (!draftThought.title || draftThought.title.trim() === '') {
            void Swal.fire({
                icon: 'warning',
                title: 'Missing title',
                text: 'Please add a title before saving your thought.',
                confirmButtonText: 'Got it',
            });
            return;
        }

        const hasMoodBlock = draftThought.blocks.some(b => b.type === 'mood');
        if (!hasMoodBlock) {
            void Swal.fire({
                icon: 'info',
                title: 'Add an emotion',
                text: 'Add at least one emotion block to save this thought.',
                confirmButtonText: 'Understood',
            });
            return;
        }

        const { createdAt, updatedAt, ...thoughtToSave } = draftThought;
        void createdAt; // avoid eslint unused-var while excluding from updates
        void updatedAt; // avoid eslint unused-var while excluding from updates
        manager.updateThought(draftThought.id, thoughtToSave);
        refreshThought();
    };

    const back = async () => {
        // If the thought is empty (no title and no blocks), delete it silently when leaving
        if (isEmptyThought(draftThought)) {
            manager.deleteThought(thought.id);
            backAction();
            return;
        }

        if (isDirty) {
            const result = await Swal.fire({
                title: 'Unsaved changes',
                text: 'You have unsaved changes. Leave without saving?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Leave',
                cancelButtonText: 'Stay',
                reverseButtons: true,
            });
            if (result.isConfirmed) {
                const t = manager.getThought(thoughtId);
                if (t && isEmptyThought(t)) {
                    manager.deleteThought(thought.id);
                    backAction();
                    return;
                }
                backAction();
            }
        } else {
            backAction();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-50 items-center bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center">
                    <h1 className="text-base font-medium text-gray-600">
                        {draftThought.title ? (draftThought.title.length > 20 ? draftThought.title.substring(0, 20).trim() + '...' : draftThought.title) : 'Untitled thought'}
                    </h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-4">
                {(draftThought.blocks.length > 0 || !haveToHaveABlockForHeader) && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                        <div className="px-6 pt-4">
                            <input
                                type="text"
                                value={draftThought.title || ''}
                                onChange={handleTitleChange}
                                placeholder="Thought title"
                                className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent mb-2 resize-none"
                            />

                            <div className="flex items-center mb-6">
                                <select
                                    value={draftThought.category || ''}
                                    onChange={handleCategoryChange}
                                    className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <option value="">No Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                {draftThought.tags && draftThought.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {draftThought.tags.map(tag => (
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

                                <div className="flex w-full relative items-center space-x-2">
                                    <div className="flex-1 relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onBlur={handleInputBlur}
                                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                            placeholder="Add a descriptive tag"
                                            className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-gray-50/50"
                                        />
                                        {showSuggestions && filteredSuggestions.length > 0 && (
                                            <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'none' }}>
                                                <ul
                                                    className="absolute  border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto min-w-[200px] backdrop-blur-sm bg-white/95"
                                                    style={{
                                                        pointerEvents: 'auto',
                                                        left: `${inputRef.current?.getBoundingClientRect()?.left || 0}px`,
                                                        top: `${(inputRef.current?.getBoundingClientRect()?.bottom || 0) + 4}px`,
                                                        width: `${inputRef.current?.getBoundingClientRect()?.width || 200}px`,
                                                        zIndex: 9999
                                                    }}
                                                >
                                                    {filteredSuggestions.map((suggestion, index) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 text-gray-800 hover:text-blue-700 font-medium first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0 hover:shadow-sm"
                                                        >
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-60"></span>
                                                            {suggestion}
                                                        </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={addTag}
                                        className="shrink-0 w-12 h-12 inline-flex items-center justify-center bg-gray-300 text-gray-800 rounded-xl transition-all duration-300 font-medium shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ThoughtBlocks
                    blocks={draftThought.blocks}
                    onDeleteBlock={deleteBlock}
                    onUpdateBlock={updateBlock}
                    onAddSecondaryMood={addSecondaryMood}
                    onRemoveSecondaryMood={removeSecondaryMood}
                    onFileUpload={handleFileUpload}
                    onUseCurrentLocation={() => {}}
                />
            </div>


            <ToolBar add={addBlock} back={back} handleSave={handleSave} isDirty={isDirty}/>
        </div>
    );
}