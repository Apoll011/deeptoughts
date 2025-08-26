export type mediaType = 'image' | 'video' | 'audio';

export interface MediaAttachment {
    id: string;
    type: mediaType;
    url: string;
    caption?: string;
}

export interface MediaBlockProps {
    media: MediaAttachment;
    className?: string;
}


export interface LocationInfo {
    id: string;
    name: string;
    coordinates?: { lat: number; lng: number };
    address?: string;
    city?: string;
    country?: string;
    timezone?: string;
    weather?: {
        condition: string;
        temperature?: number;
        icon?: string;
    };
}

export interface MoodInfo {
    id: string;
    primary: string;
    intensity: number;
    secondary?: string[];
    color?: string;
    emoji?: string;
    note?: string;
}

export type blockType = 'text' | 'media' | 'location' | 'mood';

export interface ThoughtBlock {
    id: string;
    type: blockType;
    content: string;
    position: number;
    media?: MediaAttachment;
    location?: LocationInfo;
    mood?: MoodInfo;
    timestamp?: Date;
}

export type thought_Mood = 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'grateful' | 'reflective' | 'neutral';

export const emotions = [
    'happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'reflective',
    'confident', 'frustrated', 'hopeful', 'content', 'energetic',
    'nostalgic', 'curious', 'overwhelmed', 'inspired', 'lonely', 'proud'
];

export const moodEmojis: Record<string, string> = {
    happy: '😊', sad: '😢', excited: '🤩', calm: '😌', anxious: '😰',
    grateful: '🙏', reflective: '🤔', confident: '💪', peaceful: '☮️',
    frustrated: '😤', hopeful: '🌟', content: '😄', energetic: '⚡',
    nostalgic: '🌅', curious: '🔍', overwhelmed: '🤯', inspired: '💡',
    lonely: '😞', proud: '🏆'
};

export const weatherConditions = [
    'clear', 'cloudy', 'partly-cloudy', 'rainy', 'stormy', 'snowy',
    'foggy', 'windy', 'hot', 'cold'
];

export const weatherIcons: Record<string, string> = {
    clear: '☀️', cloudy: '☁️', 'partly-cloudy': '⛅', rainy: '🌧️',
    stormy: '⛈️', snowy: '❄️', foggy: '🌫️', windy: '💨',
    hot: '🔥', cold: '🧊'
};

export interface Thought {
    id: string;
    title: string;
    blocks: ThoughtBlock[];
    primaryEmotion: string;
    tags: string[];
    category: string;
    createdAt: Date;
    updatedAt: Date;
    isFavorite: boolean;
    mood: thought_Mood;
    weather?: string;
    location?: string;
}

export type ViewMode = 'grid' | 'list' | 'month';
export type CurrentView = 'timeline' | 'mindstream' | 'editor' | 'new';