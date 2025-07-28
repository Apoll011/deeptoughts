export interface MediaAttachment {
    id: string;
    type: 'image' | 'audio' | 'video';
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
    energy?: 'low' | 'medium' | 'high';
    color?: string;
    emoji?: string;
    note?: string;
}

export interface ThoughtBlock {
    id: string;
    type: 'text' | 'media' | 'location' | 'mood';
    content: string;
    position: number;
    media?: MediaAttachment;
    location?: LocationInfo;
    mood?: MoodInfo;
    timestamp?: Date;
}

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
    mood: 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'grateful' | 'reflective';
    weather?: string;
    location?: string;
}

export type ViewMode = 'grid' | 'list' | 'month';
export type CurrentView = 'timeline' | 'mindstream' | 'editor';
