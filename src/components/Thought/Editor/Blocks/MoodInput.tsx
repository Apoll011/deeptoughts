import {emotions, moodEmojis, type MoodInfo, type ThoughtBlock} from "../../../../models/types.ts";
import {Battery, BatteryLow, X, Zap} from "lucide-react";

export function MoodInput({block, onUpdateBlock, onAddSecondaryMood, onRemoveSecondaryMood}: { block: ThoughtBlock, onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void, onAddSecondaryMood: (blockId: string, emotion: string) => void, onRemoveSecondaryMood: (blockId: string, emotion: string) => void}) {
    const getEnergyIcon = (energy?: string) => {
        switch (energy) {
            case 'low': return <BatteryLow className="w-4 h-4 text-red-500" />;
            case 'high': return <Zap className="w-4 h-4 text-yellow-500" />;
            default: return <Battery className="w-4 h-4 text-green-500" />;
        }
    };

    return (
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
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
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
    );
}