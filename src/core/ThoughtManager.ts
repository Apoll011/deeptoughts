import type {Thought, thought_Mood, ThoughtBlock} from '../models/types';
import type {IStorage} from '../storage/storage.interface';
import { sortBlocksByPosition, formatLocation, formatWeather } from './utils';
import type {FilterType} from "../components/UI/FilterPanel.tsx";
import Swal from 'sweetalert2';

export class ThoughtManager {
    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    createThought(data: Omit<Thought, 'createdAt' | 'updatedAt'>): Thought {
        const now = new Date();
        const thought: Thought = {
            ...data,
            createdAt: now,
            updatedAt: now,
        };
        this.storage.saveThought(thought);
        return thought;
    }

    getThought(id: string): Thought | undefined {
        return this.storage.getThought(id);
    }

    getAllThoughts(): Thought[] {
        return this.storage.getAllThoughts().map(t => ({
            ...t,
            blocks: sortBlocksByPosition(t.blocks),
        }));
    }

    updateThought(id: string, updates: Partial<Thought>): void {
        const thought = this.getThought(id);
        if (!thought) return;

        if (updates.blocks) {
            const firstLocationBlock = updates.blocks.find(b => b.type === 'location');
            updates.location = firstLocationBlock && firstLocationBlock.location ? formatLocation(firstLocationBlock.location) : undefined;
            updates.weather = firstLocationBlock && firstLocationBlock.location ? formatWeather(firstLocationBlock.location) : undefined;

            const moodBlocks = updates.blocks.filter(b => b.type === 'mood' && b.mood);
            if (moodBlocks.length > 0) {
                moodBlocks.sort((a, b) => (a.mood?.intensity ?? 0) - (b.mood?.intensity ?? 0));
                const medianIndex = Math.floor(moodBlocks.length / 2);
                const medianMoodBlock = moodBlocks[medianIndex];
                if (medianMoodBlock.mood) {
                    updates.mood = medianMoodBlock.mood.primary as thought_Mood;
                    updates.primaryEmotion = medianMoodBlock.mood.emoji;
                }
            } else {
                updates.mood = "calm";
                updates.primaryEmotion = '';
            }
        }

        const updated = {
            ...thought,
            ...updates,
            updatedAt: new Date(),
        };
        this.storage.saveThought(updated);
    }

    deleteThought(id: string): void {
        this.storage.deleteThought(id);
    }

    addBlock(thoughtId: string, block: ThoughtBlock): ThoughtBlock | undefined {
        const thought = this.getThought(thoughtId);
        if (!thought) return;

        const newBlock: ThoughtBlock = block;
        thought.blocks.push(newBlock);
        this.storage.saveThought(thought);
        return newBlock;
    }

    updateBlock(thoughtId: string, blockId: string, updates: Partial<ThoughtBlock>): void {
        const thought = this.getThought(thoughtId);
        if (!thought) return;

        const blockIndex = thought.blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;

        thought.blocks[blockIndex] = {
            ...thought.blocks[blockIndex],
            ...updates,
        };

        this.storage.saveThought(thought);
    }

    deleteBlock(thoughtId: string, blockId: string): void {
        const thought = this.getThought(thoughtId);
        if (!thought) return;

        thought.blocks = thought.blocks.filter(b => b.id !== blockId);
        this.storage.saveThought(thought);
    }

    searchThoughts(query: string): Thought[] {
        return this.getAllThoughts().filter(t =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            t.blocks.some(b => b.content?.toLowerCase().includes(query.toLowerCase()))
        );
    }

    searchThoughtsFromList(query: string, thougths: Thought[]): Thought[] {
        return thougths.filter(t =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            t.blocks.some(b => b.content?.toLowerCase().includes(query.toLowerCase()))
        );
    }

    toggleFavorite(id: string): void {
        const thought = this.getThought(id);
        if (!thought) return;
        this.updateThought(id, { isFavorite: !thought.isFavorite });
        console.log(this.getThought(id));
    }

    filterThoughts(filters: FilterType): Thought[] {
        return this.getAllThoughts().filter(thought => {
            const tagMatch = filters.tags.length === 0 || filters.tags.some(tag => thought.tags.includes(tag));
            const categoryMatch = filters.categories.length === 0 || filters.categories.includes(thought.category);
            const favoriteMatch = !filters.favorites || thought.isFavorite;
            const moodMatch = filters.moods.length === 0 || filters.moods.includes(thought.mood);
            return tagMatch && categoryMatch && favoriteMatch && moodMatch;
        });
    }

    shareThought(id: string) {
        const thought = this.getThought(id);
        if (!thought) return;
        console.log(`Sharing thought: ${thought.title}`);
        void Swal.fire({
            icon: 'success',
            title: 'Shared',
            text: `Sharing: ${thought.title}`,
            timer: 1500,
            showConfirmButton: false
        });
    };

    allTags() {
       return [...new Set(this.getAllThoughts().flatMap(thought => thought.tags))];
    };

    allCategories() {
        return [...new Set(this.getAllThoughts().map(thought => thought.category))];
    };

    allMoods() {
        return [...new Set(this.getAllThoughts().map(thought => thought.mood))];
    };

    allLocations() {
        return [...new Set(this.getAllThoughts().flatMap(thought => thought.blocks.filter(block => block.type === 'location').map(block => block.location)))];
    };

    allWeather() {
        return [...new Set(this.getAllThoughts().flatMap(thought => thought.blocks.filter(block => block.type === 'location').map(block => block.location)))];
    };
}