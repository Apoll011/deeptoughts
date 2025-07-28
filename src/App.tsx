import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Grid3X3, List, ChevronLeft, MapPin } from 'lucide-react';
import type {CurrentView, Thought, ViewMode} from './types';
import {CalendarView} from "./components/CalendarView.tsx";
import {ThoughtCard} from "./components/ThoughtCard.tsx";
import {ThoughtBlockRenderer} from "./components/ThoughBlockRenderer.tsx";

const mockThoughts: Thought[] = [
    {
        id: '1',
        title: "Sunrise at the Pier",
        blocks: [
            {
                id: 'b1',
                type: 'text',
                content: "Caught the first light of dawn. Everything felt brand new.",
                position: 0,
                timestamp: new Date(2025, 6, 1, 5, 12)
            },
            {
                id: 'b2',
                type: 'media',
                content: "Photo of the horizon",
                position: 1,
                media: {
                    id: 'm1',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    caption: "Golden sky meeting the sea"
                }
            }
        ],
        primaryEmotion: "🌅",
        tags: ["morning", "sea", "peace"],
        category: "Nature",
        createdAt: new Date(2025, 6, 1),
        updatedAt: new Date(2025, 6, 1),
        isFavorite: false,
        mood: 'grateful',
        weather: "Clear, 61°F",
        location: "Santa Monica Pier"
    },
    {
        id: '2',
        title: "Late Night Coding Rush",
        blocks: [
            {
                id: 'b1',
                type: 'text',
                content: "Finally cracked the bug after hours. Keyboard felt like a musical instrument tonight.",
                position: 0
            },
            {
                id: 'b2',
                type: 'media',
                content: "Victory sound",
                position: 1,
                media: {
                    id: 'm2',
                    type: 'audio',
                    url: '/music.mp3',
                    caption: "Button click and success chime"
                    // duration and waveform will be generated on the fly
                }
            },
            {
                id: 'b3',
                type: 'mood',
                content: "Felt proud and energized.",
                position: 2,
                mood: {
                    id: 'mood1',
                    primary: "excited",
                    intensity: 8,
                    energy: 'high',
                    emoji: "🚀",
                    tags: ["focus", "tech"],
                    color: "#FF9800",
                    note: "Pulled an all-nighter but worth it."
                }
            }
        ],
        primaryEmotion: "🤓",
        tags: ["code", "win"],
        category: "Work",
        createdAt: new Date(2025, 6, 2, 2, 44),
        updatedAt: new Date(2025, 6, 2, 2, 47),
        isFavorite: true,
        mood: 'excited'
    },
    {
        id: '3',
        title: "City Stroll",
        blocks: [
            {
                id: 'b1',
                type: 'location',
                content: "Walked through the heart of Lisbon.",
                position: 0,
                location: {
                    id: 'loc1',
                    name: "Praça do Comércio",
                    address: "Rua Augusta, Lisboa",
                    city: "Lisboa",
                    country: "Portugal",
                    coordinates: { lat: 38.7071, lng: -9.1355 },
                    timezone: "Europe/Lisbon",
                    weather: {
                        condition: "Sunny",
                        temperature: 26,
                        icon: "☀️"
                    }
                }
            }
        ],
        primaryEmotion: "🙂",
        tags: ["walk", "city", "portugal"],
        category: "Travel",
        createdAt: new Date(2025, 6, 3, 10),
        updatedAt: new Date(2025, 6, 3, 10),
        isFavorite: false,
        mood: 'calm',
        weather: "Sunny, 26°C",
        location: "Lisboa"
    },
    {
        id: '4',
        title: "Deep Thoughts in the Library",
        blocks: [
            {
                id: 'b1',
                type: 'text',
                content: "Read an essay on time perception. Mind blown 🤯.",
                position: 0
            },
            {
                id: 'b2',
                type: 'text',
                content: "If time is a dimension, then memory is time travel. Makes me wonder about my own narrative.",
                position: 1
            }
        ],
        primaryEmotion: "🧠",
        tags: ["philosophy", "reading", "memory"],
        category: "Reflection",
        createdAt: new Date(2025, 6, 4),
        updatedAt: new Date(2025, 6, 4),
        isFavorite: false,
        mood: 'reflective'
    },
    {
        id: '5',
        title: "Playground Laughter",
        blocks: [
            {
                id: 'b1',
                type: 'media',
                content: "Captured joy",
                position: 0,
                media: {
                    id: 'm3',
                    type: 'video',
                    url: 'https://videos.pexels.com/video-files/4753007/4753007-uhd_2560_1440_24fps.mp4',
                    duration: 30,
                    caption: "Children running and laughing"
                }
            }
        ],
        primaryEmotion: "😄",
        tags: ["joy", "childhood", "play"],
        category: "Family",
        createdAt: new Date(2025, 6, 5),
        updatedAt: new Date(2025, 6, 5),
        isFavorite: true,
        mood: 'happy'
    },
    {
        id: '21',
        title: "Morning Reflections at the Mountain Lake",
        blocks: [
            {
                id: 'b1',
                type: 'text',
                content: "Woke up before dawn to catch the sunrise over the lake. The air was crisp, and everything was still except for a gentle breeze.",
                position: 0,
                timestamp: new Date(2025, 6, 10, 5, 45)
            },
            {
                id: 'b2',
                type: 'location',
                content: "Standing on the edge of Ramsau bei Berchtesgaden lake.",
                position: 1,
                location: {
                    id: 'loc21',
                    name: "Ramsau Lake",
                    city: "Ramsau bei Berchtesgaden",
                    country: "Germany",
                    coordinates: { lat: 47.620, lng: 13.006 },
                    timezone: "Europe/Berlin",
                    weather: {
                        condition: "Clear",
                        temperature: 12,
                        icon: "☀️"
                    },
                    address: "Ramsau, Bavaria, Germany"
                }
            },
            {
                id: 'b3',
                type: 'media',
                content: "Sunrise over lake and snowy peaks",
                position: 2,
                media: {
                    id: 'm21',
                    type: 'image',
                    url: 'https://plus.unsplash.com/premium_photo-1751667124857-32b5a1c63d8a?q=80&w=441&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // example real unsplash link placeholder
                    caption: "Sunrise illuminating lake beneath mountain peaks"
                }
            },
            {
                id: 'b4',
                type: 'text',
                content: "Light crept across the peaks and glassy water mirrored the sky. Colors shifted from violet to gold in minutes.",
                position: 3
            },
            {
                id: 'b5',
                type: 'media',
                content: "Soft audio of lapping water",
                position: 4,
                media: {
                    id: 'm22',
                    type: 'audio',
                    url: 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3',
                    caption: "Gentle wave sounds at dawn"
                    // duration and waveform will be generated on the fly
                }
            },
            {
                id: 'b6',
                type: 'text',
                content: "Reflected on the stillness—how moments like this anchor me. I felt small, yet infinitely connected to everything.",
                position: 5
            },
            {
                id: 'b7',
                type: 'mood',
                content: "Awe and peace washed over me.",
                position: 6,
                mood: {
                    id: 'mood21',
                    primary: "reflective",
                    intensity: 9,
                    energy: 'low',
                    secondary: ["peaceful", "awe"],
                    emoji: "🌄",
                    tags: ["nature", "serenity", "mindfulness"],
                    color: "#89CFF0",
                    note: "Seeing the sunrise reflected in the lake felt almost sacred."
                }
            },
            {
                id: 'b8',
                type: 'text',
                content: "After a while, I sipped some warm tea and watched the mountains wake up. Silence felt like a melody.",
                position: 7
            }
        ],
        primaryEmotion: "🌅",
        tags: ["sunrise", "mountains", "reflection", "nature"],
        category: "Travel",
        createdAt: new Date(2025, 6, 10, 5, 45),
        updatedAt: new Date(2025, 6, 10, 6, 15),
        isFavorite: true,
        mood: 'reflective',
        weather: "Clear, 12°C",
        location: "Ramsau bei Berchtesgaden"
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
