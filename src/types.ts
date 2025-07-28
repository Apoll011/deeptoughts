export interface MediaAttachment {
    id: string;
    type: 'image' | 'audio' | 'video';
    url: string;
    caption?: string;
    duration?: number; // for audio/video in seconds
    waveform?: number[]; // for audio visualization
}

export interface ThoughtBlock {
    id: string;
    type: 'text' | 'media' | 'location' | 'mood';
    content: string;
    position: number;
    media?: MediaAttachment;
    location?: {
        name: string;
        coordinates?: { lat: number; lng: number };
    };
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
