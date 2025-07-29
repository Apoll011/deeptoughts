// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Type, Image, MapPin, Heart, Eye, Trash2, GripVertical, Upload, Plus, X, Sparkles, Globe, Thermometer, Cloud, Sun, CloudRain, Zap, Battery, BatteryLow } from 'lucide-react';
import {v4 as uuidv4} from 'uuid';

const emotions = ['joy', 'contentment', 'excitement', 'gratitude', 'love', 'sadness', 'anxiety', 'frustration', 'anger', 'fear', 'nostalgia', 'wonder'];
const categories = ['Personal', 'Work', 'Travel', 'Relationships', 'Goals', 'Reflections', 'Dreams', 'Memories'];
const moods = ['happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'reflective'];
const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Foggy', 'Windy', 'Clear'];
const weatherConditions = ['clear', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy', 'windy', 'partly-cloudy'];
const energyLevels = ['low', 'medium', 'high'];

export default function ThoughtEditor() {
    const [isPreview, setIsPreview] = useState(false);
    const [thought, setThought] = useState({
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
    const fileInputRef = useRef(null);

    const addBlock = (type) => {
        const newBlock = {
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
                type: 'image',
                url: '',
                caption: ''
            };
        }

        setThought(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
            updatedAt: new Date()
        }));
    };

    const updateBlock = (blockId, updates) => {
        setThought(prev => ({
            ...prev,
            blocks: prev.blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
            ),
            updatedAt: new Date()
        }));
    };

    const deleteBlock = (blockId) => {
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

    const removeTag = (tagToRemove) => {
        setThought(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleFileUpload = (blockId, event) => {
        const file = event.target.files[0];
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

    const addSecondaryMood = (blockId, mood) => {
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

    const removeSecondaryMood = (blockId, moodToRemove) => {
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

    const moodEmojis = {
        'joy': '😄', 'contentment': '😌', 'excitement': '🤩', 'gratitude': '🙏',
        'love': '💕', 'sadness': '😢', 'anxiety': '😰', 'frustration': '😤',
        'anger': '😠', 'fear': '😨', 'nostalgia': '🥺', 'wonder': '✨'
    };

    const weatherIcons = {
        'clear': '☀️', 'cloudy': '☁️', 'rainy': '🌧️', 'stormy': '⛈️',
        'snowy': '❄️', 'foggy': '🌫️', 'windy': '💨', 'partly-cloudy': '⛅'
    };

    const getEnergyIcon = (level) => {
        switch(level) {
            case 'low': return <BatteryLow className="w-4 h-4" />;
            case 'medium': return <Battery className="w-4 h-4" />;
            case 'high': return <Zap className="w-4 h-4" />;
            default: return <Battery className="w-4 h-4" />;
        }
    };

    if (isPreview) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setIsPreview(false)}
                        className="mb-6 flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                    >
                        <X className="w-4 h-4" />
                        <span>Back to Edit</span>
                    </button>
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            {thought.title || 'Untitled Thought'}
                        </h1>
                        <p className="text-gray-600">Preview mode - your thought will appear here</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"></div>

                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Create New Thought
                                </h1>
                                <p className="text-gray-500 text-sm">Capture your moment in rich detail</p>
                            </div>
                        </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <Heart className="w-4 h-4" />
                                <span>Primary Emotion</span>
                            </label>
                            <select
                                value={thought.primaryEmotion}
                                onChange={(e) => setThought(prev => ({ ...prev, primaryEmotion: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                            >
                                <option value="">Select emotion</option>
                                {emotions.map(emotion => (
                                    <option key={emotion} value={emotion}>
                                        {moodEmojis[emotion]} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
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

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Overall Mood</label>
                            <select
                                value={thought.mood}
                                onChange={(e) => setThought(prev => ({ ...prev, mood: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                            >
                                {moods.map(mood => (
                                    <option key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                <Cloud className="w-4 h-4" />
                                <span>Weather</span>
                            </label>
                            <select
                                value={thought.weather}
                                onChange={(e) => setThought(prev => ({ ...prev, weather: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                            >
                                <option value="">Select weather</option>
                                {weatherOptions.map(weather => (
                                    <option key={weather} value={weather}>{weather}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>Location</span>
                        </label>
                        <input
                            type="text"
                            value={thought.location}
                            onChange={(e) => setThought(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Where are you creating this thought?"
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                        />
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

                <div className="space-y-6 mb-8">
                    {thought.blocks
                        .sort((a, b) => a.position - b.position)
                        .map((block, index) => (
                            <div key={block.id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 capitalize">
                                                {block.type} Block
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteBlock(block.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8">
                                    {block.type === 'text' && (
                                        <textarea
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                            placeholder="Share your thoughts, feelings, experiences..."
                                            rows={6}
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 resize-none text-lg leading-relaxed bg-gray-50/50"
                                        />
                                    )}

                                    {block.type === 'media' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <select
                                                    value={block.media?.type || 'image'}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        media: { ...block.media, type: e.target.value }
                                                    })}
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                >
                                                    <option value="image">📸 Image</option>
                                                    <option value="video">🎥 Video</option>
                                                    <option value="audio">🎵 Audio</option>
                                                </select>

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*,video/*,audio/*"
                                                    onChange={(e) => handleFileUpload(block.id, e)}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span>Upload File</span>
                                                </button>

                                                <div className="flex items-center text-gray-500 text-sm justify-center">
                                                    or enter URL below
                                                </div>
                                            </div>

                                            <input
                                                type="text"
                                                value={block.media?.url || ''}
                                                onChange={(e) => updateBlock(block.id, {
                                                    media: { ...block.media, url: e.target.value }
                                                })}
                                                placeholder="Enter media URL"
                                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                            />

                                            <input
                                                type="text"
                                                value={block.media?.caption || ''}
                                                onChange={(e) => updateBlock(block.id, {
                                                    media: { ...block.media, caption: e.target.value }
                                                })}
                                                placeholder="Add a meaningful caption"
                                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                            />
                                        </div>
                                    )}

                                    {block.type === 'location' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={block.location?.name || ''}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        location: { ...block.location, name: e.target.value }
                                                    })}
                                                    placeholder="Location name"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={block.location?.address || ''}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        location: { ...block.location, address: e.target.value }
                                                    })}
                                                    placeholder="Street address"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={block.location?.city || ''}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        location: { ...block.location, city: e.target.value }
                                                    })}
                                                    placeholder="City"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={block.location?.country || ''}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        location: { ...block.location, country: e.target.value }
                                                    })}
                                                    placeholder="Country"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Coordinates (Latitude)</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={block.location?.coordinates?.lat || ''}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            location: {
                                                                ...block.location,
                                                                coordinates: {
                                                                    ...block.location?.coordinates,
                                                                    lat: parseFloat(e.target.value)
                                                                }
                                                            }
                                                        })}
                                                        placeholder="Latitude"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Coordinates (Longitude)</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={block.location?.coordinates?.lng || ''}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            location: {
                                                                ...block.location,
                                                                coordinates: {
                                                                    ...block.location?.coordinates,
                                                                    lng: parseFloat(e.target.value)
                                                                }
                                                            }
                                                        })}
                                                        placeholder="Longitude"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                    />
                                                </div>
                                            </div>

                                            <input
                                                type="text"
                                                value={block.location?.timezone || ''}
                                                onChange={(e) => updateBlock(block.id, {
                                                    location: { ...block.location, timezone: e.target.value }
                                                })}
                                                placeholder="Timezone (e.g., America/New_York)"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                            />

                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                    <Cloud className="w-5 h-5" />
                                                    <span>Weather Details</span>
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <select
                                                        value={block.location?.weather?.condition || 'clear'}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            location: {
                                                                ...block.location,
                                                                weather: {
                                                                    ...block.location?.weather,
                                                                    condition: e.target.value,
                                                                    icon: weatherIcons[e.target.value]
                                                                }
                                                            }
                                                        })}
                                                        className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white/50"
                                                    >
                                                        {weatherConditions.map(condition => (
                                                            <option key={condition} value={condition}>
                                                                {weatherIcons[condition]} {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                                            <Thermometer className="w-4 h-4" />
                                                            <span>Temperature (°C)</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={block.location?.weather?.temperature || ''}
                                                            onChange={(e) => updateBlock(block.id, {
                                                                location: {
                                                                    ...block.location,
                                                                    weather: {
                                                                        ...block.location?.weather,
                                                                        temperature: parseInt(e.target.value)
                                                                    }
                                                                }
                                                            })}
                                                            placeholder="20"
                                                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white/50"
                                                        />
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={block.location?.weather?.icon || ''}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            location: {
                                                                ...block.location,
                                                                weather: {
                                                                    ...block.location?.weather,
                                                                    icon: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        placeholder="Weather emoji"
                                                        className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'mood' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Primary Mood</label>
                                                    <select
                                                        value={block.mood?.primary || ''}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            mood: {
                                                                ...block.mood,
                                                                primary: e.target.value,
                                                                emoji: moodEmojis[e.target.value] || '😊'
                                                            }
                                                        })}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                    >
                                                        {emotions.map(emotion => (
                                                            <option key={emotion} value={emotion}>
                                                                {moodEmojis[emotion]} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                                        {getEnergyIcon(block.mood?.energy)}
                                                        <span>Energy Level</span>
                                                    </label>
                                                    <select
                                                        value={block.mood?.energy || 'medium'}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            mood: { ...block.mood, energy: e.target.value }
                                                        })}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50"
                                                    >
                                                        {energyLevels.map(level => (
                                                            <option key={level} value={level}>
                                                                {level.charAt(0).toUpperCase() + level.slice(1)} Energy
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                                    <span>Intensity: {block.mood?.intensity || 5}/10</span>
                                                    <div className="flex-1 mx-4">
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${(block.mood?.intensity || 5) * 10}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={block.mood?.intensity || 5}
                                                    onChange={(e) => updateBlock(block.id, {
                                                        mood: { ...block.mood, intensity: parseInt(e.target.value) }
                                                    })}
                                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">Secondary Moods</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {(block.mood?.secondary || []).map(mood => (
                                                        <span
                                                            key={mood}
                                                            className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-medium border border-indigo-200"
                                                        >
                                                            {moodEmojis[mood]} {mood}
                                                            <button
                                                                onClick={() => removeSecondaryMood(block.id, mood)}
                                                                className="ml-2 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    {emotions.filter(e => e !== block.mood?.primary && !(block.mood?.secondary || []).includes(e)).map(emotion => (
                                                        <button
                                                            key={emotion}
                                                            onClick={() => addSecondaryMood(block.id, emotion)}
                                                            className="flex items-center space-x-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-sm"
                                                        >
                                                            <span>{moodEmojis[emotion]}</span>
                                                            <span className="capitalize">{emotion}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Mood Color</label>
                                                    <input
                                                        type="color"
                                                        value={block.mood?.color || '#10B981'}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            mood: { ...block.mood, color: e.target.value }
                                                        })}
                                                        className="w-full h-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Custom Emoji</label>
                                                    <input
                                                        type="text"
                                                        value={block.mood?.emoji || ''}
                                                        onChange={(e) => updateBlock(block.id, {
                                                            mood: { ...block.mood, emoji: e.target.value }
                                                        })}
                                                        placeholder="Choose an emoji"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-gray-50/50 text-center text-2xl"
                                                        maxLength="2"
                                                    />
                                                </div>
                                            </div>

                                            <textarea
                                                value={block.mood?.note || ''}
                                                onChange={(e) => updateBlock(block.id, {
                                                    mood: { ...block.mood, note: e.target.value }
                                                })}
                                                placeholder="Describe your mood in detail - what triggered it, how it feels, what you're thinking about..."
                                                rows={4}
                                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 resize-none bg-gray-50/50"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <span>Add Content Block</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => addBlock('text')}
                            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6 hover:from-blue-100 hover:to-indigo-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Type className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">Text Block</h4>
                                    <p className="text-xs text-gray-600">Write your thoughts</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => addBlock('media')}
                            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 rounded-2xl p-6 hover:from-purple-100 hover:to-pink-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Image className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">Media Block</h4>
                                    <p className="text-xs text-gray-600">Add images, videos, audio</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => addBlock('location')}
                            className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 border-2 border-emerald-200 rounded-2xl p-6 hover:from-emerald-100 hover:to-teal-200 hover:border-emerald-300 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">Location Block</h4>
                                    <p className="text-xs text-gray-600">Capture where you are</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => addBlock('mood')}
                            className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-orange-100 border-2 border-rose-200 rounded-2xl p-6 hover:from-rose-100 hover:to-orange-200 hover:border-rose-300 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">Mood Block</h4>
                                    <p className="text-xs text-gray-600">Track your emotions</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-12 py-4 rounded-2xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 font-semibold text-lg">
                        Save Thought ✨
                    </button>
                </div>
            </div>
        </div>
    );
}
