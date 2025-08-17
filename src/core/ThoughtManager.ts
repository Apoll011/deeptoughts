import type { Thought, ThoughtBlock } from '../models/types';
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
        alert(`Sharing: ${thought.title}`);
    };
}