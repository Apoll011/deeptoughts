import React, { useState } from 'react';
import { Search, Plus, Calendar, Grid3X3, List, ChevronLeft, MapPin } from 'lucide-react';
import type {CurrentView, Thought, ViewMode} from './types';
import {CalendarView} from "./components/CalendarView.tsx";
import {ThoughtCard} from "./components/ThoughtCard.tsx";
import {AudioPlayer} from "./components/AudioPlayer.tsx";

const mockThoughts: Thought[] = [
    {
        id: '1',
        title: "Lake Visit With My Parents",
        blocks: [
            {
                id: 'b1',
                type: 'text',
                content: "Beautiful day at the lake. The water was so calm and the mountains looked amazing in the distance.",
                position: 0
            },
            {
                id: 'b2',
                type: 'media',
                content: "The moment we arrived",
                position: 1,
                media: {
                    id: 'm1',
                    type: 'image',
                    url: '/api/placeholder/400/300',
                    caption: "Crystal clear lake reflection"
                }
            },
            {
                id: 'b3',
                type: 'text',
                content: "Mom packed the most amazing sandwiches, and dad brought his old fishing rod. We didn't catch anything, but the conversations were worth more than any fish.",
                position: 2
            },
            {
                id: 'b4',
                type: 'media',
                content: "Captured this moment",
                position: 3,
                media: {
                    id: 'm2',
                    type: 'audio',
                    url: '/api/placeholder/audio',
                    duration: 45,
                    caption: "Sound of gentle waves",
                    waveform: [0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.6, 0.4, 0.8]
                }
            }
        ],
        primaryEmotion: "😊",
        tags: ["family", "nature", "peace"],
        category: "Family",
        createdAt: new Date(2025, 6, 28),
        updatedAt: new Date(2025, 6, 28),
        isFavorite: true,
        mood: 'happy',
        weather: "Sunny, 72°F",
        location: "Mirror Lake, Colorado"
    },
    {
        id: '2',
        title: "Rainy Evening Reflections",
        blocks: [
            {
                id: 'b5',
                type: 'text',
                content: "The rain started just as I was settling in with my tea. There's something magical about the rhythm of raindrops on the window.",
                position: 0
            },
            {
                id: 'b6',
                type: 'media',
                content: "Recording the rain",
                position: 1,
                media: {
                    id: 'm3',
                    type: 'audio',
                    url: '/api/placeholder/audio',
                    duration: 120,
                    caption: "Rain on my window",
                    waveform: [0.1, 0.3, 0.2, 0.4, 0.3, 0.5, 0.2, 0.3, 0.4, 0.2]
                }
            },
            {
                id: 'b7',
                type: 'text',
                content: "Perfect time for reflection and gratitude. Sometimes the best moments are the quiet ones.",
                position: 2
            }
        ],
        primaryEmotion: "😌",
        tags: ["reflection", "rain", "gratitude"],
        category: "Nature",
        createdAt: new Date(2025, 6, 27),
        updatedAt: new Date(2025, 6, 27),
        isFavorite: false,
        mood: 'calm',
        weather: "Rainy, 65°F"
    }
];


const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<CurrentView>('timeline');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredThoughts = mockThoughts.filter(thought =>
        thought.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thought.blocks.some(block =>
            block.content.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        thought.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleThoughtSelect = (thought: Thought) => {
        setSelectedThought(thought);
        setCurrentView('editor');
    };

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {currentView === 'timeline' && (
                <>
                    {/* Enhanced Header */}
                    <div className="bg-white shadow-xl rounded-b-3xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        DeepThoughts
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">Your mindful journal</p>
                                </div>
                                <button
                                    onClick={() => setCurrentView('mindstream')}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search your thoughts..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`p-3 rounded-2xl transition-all duration-200 ${
                                        viewMode === 'month'
                                            ? 'bg-purple-100 text-purple-700 shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Calendar className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-2xl transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-purple-100 text-purple-700 shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-2xl transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-purple-100 text-purple-700 shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {viewMode === 'month' && (
                            <CalendarView
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                thoughts={filteredThoughts}
                                onThoughtSelect={handleThoughtSelect}
                            />
                        )}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredThoughts.map(thought => (
                                    <ThoughtCard
                                        key={thought.id}
                                        thought={thought}
                                        onSelect={handleThoughtSelect}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === 'list' && (
                            <div className="space-y-6">
                                {filteredThoughts.map(thought => (
                                    <ThoughtCard
                                        key={thought.id}
                                        thought={thought}
                                        onSelect={handleThoughtSelect}
                                        compact
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {currentView === 'editor' && selectedThought && (
                <div className="bg-white min-h-screen">
                    <div className="p-6">
                        <button
                            onClick={() => setCurrentView('timeline')}
                            className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedThought.title}
                        </h1>

                        <div className="flex items-center space-x-3 mb-6 text-sm text-gray-500">
                            <span>{selectedThought.createdAt.toLocaleDateString()}</span>
                            {selectedThought.location && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{selectedThought.location}</span>
                                    </div>
                                </>
                            )}
                            {selectedThought.weather && (
                                <>
                                    <span>•</span>
                                    <span>{selectedThought.weather}</span>
                                </>
                            )}
                        </div>

                        <div className="space-y-4">
                            {selectedThought.blocks
                                .sort((a, b) => a.position - b.position)
                                .map(block => (
                                    <div key={block.id}>
                                        {block.type === 'text' && (
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {block.content}
                                            </p>
                                        )}
                                        {block.type === 'media' && block.media && (
                                            <div className="my-4">
                                                {block.media.type === 'image' && (
                                                    <div className="rounded-2xl overflow-hidden shadow-lg">
                                                        <img
                                                            src={block.media.url}
                                                            alt={block.media.caption}
                                                            className="w-full h-auto"
                                                        />
                                                        {block.media.caption && (
                                                            <div className="p-3 bg-gray-50">
                                                                <p className="text-sm text-gray-600 italic">
                                                                    {block.media.caption}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {block.media.type === 'audio' && (
                                                    <AudioPlayer media={block.media} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;