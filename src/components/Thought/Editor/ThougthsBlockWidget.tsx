import React, {useEffect, useRef} from 'react';
import {
    GripVertical,
    Trash2,
    Upload,
    MapPin,
    Thermometer,
    Image,
    Video,
    Music,
    Zap,
    Battery,
    BatteryLow,
    X
} from 'lucide-react';
import type {ThoughtBlock, MediaAttachment, LocationInfo, MoodInfo} from '../../../types.ts';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const prevBlocksLength = useRef(blocks.length);

    const emotions = [
        'happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'reflective',
        'confident', 'peaceful', 'frustrated', 'hopeful', 'content', 'energetic',
        'nostalgic', 'curious', 'overwhelmed', 'inspired', 'lonely', 'proud'
    ];

    const moodEmojis: Record<string, string> = {
        happy: '😊', sad: '😢', excited: '🤩', calm: '😌', anxious: '😰',
        grateful: '🙏', reflective: '🤔', confident: '💪', peaceful: '☮️',
        frustrated: '😤', hopeful: '🌟', content: '😄', energetic: '⚡',
        nostalgic: '🌅', curious: '🔍', overwhelmed: '🤯', inspired: '💡',
        lonely: '😞', proud: '🏆'
    };

    const weatherConditions = [
        'clear', 'cloudy', 'partly-cloudy', 'rainy', 'stormy', 'snowy',
        'foggy', 'windy', 'hot', 'cold'
    ];

    const weatherIcons: Record<string, string> = {
        clear: '☀️', cloudy: '☁️', 'partly-cloudy': '⛅', rainy: '🌧️',
        stormy: '⛈️', snowy: '❄️', foggy: '🌫️', windy: '💨',
        hot: '🔥', cold: '🧊'
    };

    const getEnergyIcon = (energy?: string) => {
        switch (energy) {
            case 'low': return <BatteryLow className="w-4 h-4 text-red-500" />;
            case 'high': return <Zap className="w-4 h-4 text-yellow-500" />;
            default: return <Battery className="w-4 h-4 text-green-500" />;
        }
    };

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
                                <textarea
                                    value={block.content}
                                    onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                                    placeholder="What's on your mind?"
                                    rows={4}
                                    className="w-full px-0 py-0 border-0 resize-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                            )}

                            {block.type === 'media' && (
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
                            )}

                            {block.type === 'location' && (
                                <div className="space-y-4">
                                    {/* Use Current Location Button */}
                                    <button
                                        onClick={() => onUseCurrentLocation(block.id)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <span>Use current location</span>
                                    </button>

                                    {/* Location Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={block.location?.name || ''}
                                            onChange={(e) => onUpdateBlock(block.id, {
                                                location: { ...block.location, name: e.target.value } as LocationInfo
                                            })}
                                            placeholder="Location name"
                                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={block.location?.address || ''}
                                            onChange={(e) => onUpdateBlock(block.id, {
                                                location: { ...block.location, address: e.target.value } as LocationInfo
                                            })}
                                            placeholder="Address"
                                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={block.location?.city || ''}
                                            onChange={(e) => onUpdateBlock(block.id, {
                                                location: { ...block.location, city: e.target.value } as LocationInfo
                                            })}
                                            placeholder="City"
                                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={block.location?.country || ''}
                                            onChange={(e) => onUpdateBlock(block.id, {
                                                location: { ...block.location, country: e.target.value } as LocationInfo
                                            })}
                                            placeholder="Country"
                                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Weather Section */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                                            <Thermometer className="w-4 h-4" />
                                            <span>Weather</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <select
                                                value={block.location?.weather?.condition || 'clear'}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    location: {
                                                        ...block.location,
                                                        weather: {
                                                            ...block.location?.weather,
                                                            condition: e.target.value,
                                                            icon: weatherIcons[e.target.value]
                                                        }
                                                    } as LocationInfo
                                                })}
                                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                            >
                                                {weatherConditions.map(condition => (
                                                    <option key={condition} value={condition}>
                                                        {weatherIcons[condition]} {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>

                                            <input
                                                type="number"
                                                value={block.location?.weather?.temperature || ''}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    location: {
                                                        ...block.location,
                                                        weather: {
                                                            ...block.location?.weather,
                                                            temperature: parseInt(e.target.value)
                                                        }
                                                    } as LocationInfo
                                                })}
                                                placeholder="Temperature (°C)"
                                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {block.type === 'mood' && (
                                <div className="space-y-4">
                                    {/* Primary Mood and Energy */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Mood</label>
                                            <select
                                                value={block.mood?.primary || ''}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    mood: {
                                                        ...block.mood,
                                                        primary: e.target.value,
                                                        emoji: moodEmojis[e.target.value] || '😊'
                                                    } as MoodInfo
                                                })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="">Select mood</option>
                                                {emotions.map(emotion => (
                                                    <option key={emotion} value={emotion}>
                                                        {moodEmojis[emotion]} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center space-x-1">
                                                {getEnergyIcon(block.mood?.energy)}
                                                <span>Energy</span>
                                            </label>
                                            <select
                                                value={block.mood?.energy || 'medium'}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    mood: { ...block.mood, energy: e.target.value as 'low' | 'medium' | 'high' } as MoodInfo
                                                })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Intensity Slider */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Intensity: {block.mood?.intensity || 5}/10
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={block.mood?.intensity || 5}
                                            onChange={(e) => onUpdateBlock(block.id, {
                                                mood: { ...block.mood, intensity: parseInt(e.target.value) } as MoodInfo
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    {/* Secondary Moods */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Additional feelings</label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {(block.mood?.secondary || []).map(mood => (
                                                <span
                                                    key={mood}
                                                    className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                                                >
                          {moodEmojis[mood]} {mood}
                                                    <button
                                                        onClick={() => onRemoveSecondaryMood(block.id, mood)}
                                                        className="ml-1 hover:text-blue-900 transition-colors"
                                                    >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {emotions
                                                .filter(e => e !== block.mood?.primary && !(block.mood?.secondary || []).includes(e))
                                                .slice(0, 6)
                                                .map(emotion => (
                                                    <button
                                                        key={emotion}
                                                        onClick={() => onAddSecondaryMood(block.id, emotion)}
                                                        className="flex items-center space-x-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-sm text-gray-600"
                                                    >
                                                        <span>{moodEmojis[emotion]}</span>
                                                        <span className="capitalize">{emotion}</span>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Mood Note */}
                                    <textarea
                                        value={block.mood?.note || ''}
                                        onChange={(e) => onUpdateBlock(block.id, {
                                            mood: { ...block.mood, note: e.target.value } as MoodInfo
                                        })}
                                        placeholder="What's behind this feeling?"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ThoughtBlocks;