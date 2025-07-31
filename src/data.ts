import type {Thought} from "./types.ts";

export const mockThoughts: Thought[] = [
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
                    url: 'deeptoughts/music.mp3',
                    caption: "Button click and success chime"
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
                    url: 'deeptoughts/video.mp4',
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
                    url: 'https://plus.unsplash.com/premium_photo-1751667124857-32b5a1c63d8a?q=80&w=441&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
