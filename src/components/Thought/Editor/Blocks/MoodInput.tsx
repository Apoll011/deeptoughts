import {useState} from "react";
import {emotions, moodEmojis, type MoodInfo, type ThoughtBlock} from "../../../../models/types.ts";
import {X, ChevronRight, ChevronLeft} from "lucide-react";

export function MoodInput({block, onUpdateBlock, onAddSecondaryMood, onRemoveSecondaryMood}: {
    block: ThoughtBlock,
    onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void,
    onAddSecondaryMood: (blockId: string, emotion: string) => void,
    onRemoveSecondaryMood: (blockId: string, emotion: string) => void
}) {
    const [step, setStep] = useState(1);

    const steps = 5;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {step < 5 && (
                <div className="flex justify-center space-x-2">
                    {Array.from({length: steps - 1 }).map((_, i) => (
                        <div key={i} className={`h-2 w-6 rounded-full ${i+1 <= step ? "bg-blue-500" : "bg-gray-200"}`} />
                    ))}
                </div>
            )}

            {step === 1 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">How are you feeling?</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {emotions.map(emotion => (
                            <button
                                key={emotion}
                                onClick={() => {
                                    onUpdateBlock(block.id, {
                                        mood: {
                                            ...block.mood,
                                            primary: emotion,
                                            emoji: moodEmojis[emotion]
                                        } as MoodInfo
                                    });
                                    setStep(2);
                                }}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm
                                    ${block.mood?.primary === emotion ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"} transition`}
                            >
                                <span className="text-2xl">{moodEmojis[emotion]}</span>
                                <span className="capitalize text-sm mt-1">{emotion}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">How intense is it?</h2>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={block.mood?.intensity || 5}
                        onChange={(e) => onUpdateBlock(block.id, {
                            mood: { ...block.mood, intensity: parseInt(e.target.value) } as MoodInfo
                        })}
                        className="w-full accent-blue-500"
                    />
                    <p className="text-center text-sm mt-2">Intensity: {block.mood?.intensity || 5}/10</p>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Any additional feelings?</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(block.mood?.secondary || []).map(mood => (
                            <span key={mood} className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {moodEmojis[mood]} {mood}
                                <button onClick={() => onRemoveSecondaryMood(block.id, mood)} className="ml-1">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {emotions
                            .filter(e => e !== block.mood?.primary && !(block.mood?.secondary || []).includes(e))
                            .slice(0, 6)
                            .map(emotion => (
                                <button
                                    key={emotion}
                                    onClick={() => onAddSecondaryMood(block.id, emotion)}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm"
                                >
                                    <span>{moodEmojis[emotion]}</span>
                                    <span className="capitalize">{emotion}</span>
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Want to add a note?</h2>
                    <textarea
                        value={block.mood?.note || ''}
                        onChange={(e) => onUpdateBlock(block.id, {
                            mood: { ...block.mood, note: e.target.value } as MoodInfo
                        })}
                        placeholder="What's behind this feeling?"
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                </div>
            )}

            {step === 5 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Mood</h2>
                    <div className="space-y-3">
                        <div onClick={() => setStep(1)} className="p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                            <strong>Mood:</strong> {block.mood?.emoji} {block.mood?.primary}
                        </div>
                        <div onClick={() => setStep(2)} className="p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                            <strong>Intensity:</strong> {block.mood?.intensity}/10
                        </div>
                        <div onClick={() => setStep(3)} className="p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                            <strong>Additional:</strong> {(block.mood?.secondary || []).join(", ") || "None"}
                        </div>
                        <div onClick={() => setStep(4)} className="p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                            <strong>Note:</strong> {block.mood?.note || "No note"}
                        </div>
                    </div>
                </div>
            )}

            {step < 5 && (
                <div className="flex justify-between pt-4">
                    {step > 1 && (
                        <button onClick={() => setStep(step-1)} className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
                            <ChevronLeft className="w-4 h-4 mr-1"/> Back
                        </button>
                    )}
                    <button onClick={() => setStep(step+1)} className="flex items-center ml-auto px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
                        Next <ChevronRight className="w-4 h-4 ml-1"/>
                    </button>
                </div>
            )}
        </div>
    );
}