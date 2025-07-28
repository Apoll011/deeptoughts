import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Grid3X3, List, ChevronLeft, MapPin } from 'lucide-react';
import type {CurrentView, Thought, ViewMode} from './types';
import {CalendarView} from "./components/CalendarView.tsx";
import {ThoughtCard} from "./components/ThoughtCard.tsx";
import {ThoughtBlockRenderer} from "./components/ThoughBlockRenderer.tsx";

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
                    url: 'data:image/jpeg;base64,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',
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
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerVisibility, setHeaderVisibility] = useState(1); // 1 = fully visible, 0 = hidden

    useEffect(() => {
        const controlScrollElements = () => {
            const currentScrollY = window.scrollY;
            const maxScrollForAnimation = 120;

            const newVisibility = Math.max(0, Math.min(1, 1 - (currentScrollY / maxScrollForAnimation)));

            setHeaderVisibility(newVisibility);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlScrollElements);

        return () => {
            window.removeEventListener('scroll', controlScrollElements);
        };
    }, [lastScrollY]);

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
                    <div className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
                        <div className="bg-white shadow-xl rounded-b-3xl backdrop-blur-sm "
                             style={{
                                 paddingBottom: `${6 - (headerVisibility * 2) }px`,
                                 transition: 'none'
                             }}>
                            <div className="p-6" 
                                 style={{ 
                                     paddingBottom: `${2 + (headerVisibility * 2)}px`,
                                     transition: 'none'
                                 }}>
                                <div className="flex items-center justify-between">
                                    <div className="transform hover:scale-105" 
                                         style={{ 
                                             transform: `scale(${1 + ((1 - headerVisibility) * 0.05)})`,
                                             transition: 'none'
                                         }}>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                                            DeepThoughts
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-1 italic">Your mindful journal</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden transform"
                                     style={{
                                         maxHeight: `${headerVisibility * 384}px`,
                                         opacity: headerVisibility,
                                         marginTop: `${headerVisibility * 18}px`,
                                         transform: `translateY(${(1 - headerVisibility) * -40}px)`,
                                         transition: 'none'
                                     }}>
                                    <div className="relative mb-2 transform transition-all duration-300 hover:scale-[1.02]">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                                        <input
                                            type="text"
                                            placeholder="Search your thoughts..."
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-inner border border-gray-100"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4 justify-center pb-2">
                                        <button
                                            onClick={() => setViewMode('month')}
                                            className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                                viewMode === 'month'
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                            }`}
                                        >
                                            <Calendar className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                                viewMode === 'grid'
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                            }`}
                                        >
                                            <Grid3X3 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                                viewMode === 'list'
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                            }`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-54"></div>

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
                                        compact={true}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setCurrentView('mindstream')}
                            className="fixed bottom-10 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-5 rounded-full transform hover:scale-110 z-50"
                            style={{
                                transform: `translateY(${(1 - headerVisibility) * 112}px) rotate(${(1 - headerVisibility) * 90}deg)`, // 28 * 4 = 112px
                                opacity: headerVisibility,
                                boxShadow: headerVisibility > 0.5 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                                transition: 'none'
                            }}
                        >
                            <Plus className="w-7 h-7" 
                                  style={{
                                      transform: `rotate(${(1 - headerVisibility) * 45}deg)`,
                                      transition: 'none'
                                  }} />
                        </button>
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
                                    <ThoughtBlockRenderer block={block} />
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
