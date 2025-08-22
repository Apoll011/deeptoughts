import type {IStorage} from './storage.interface';
import type {Thought} from '../models/types';

export class LocalStorageThougths implements IStorage {
    private readonly storageKey = 'thoughts-storage';

    getThought(id: string): Thought | undefined {
        const thoughts = this.getStoredThoughts();
        return thoughts.find(thought => thought.id === id);
    }

    getAllThoughts(): Thought[] {
        return this.getStoredThoughts();
    }

    saveThought(thought: Thought): void {
        const thoughts = this.getStoredThoughts();
        const existingIndex = thoughts.findIndex(t => t.id === thought.id);

        const updatedThought = { ...thought, updatedAt: new Date() };

        if (existingIndex >= 0) {
            thoughts[existingIndex] = updatedThought;
        } else {
            thoughts.push(updatedThought);
        }

        this.saveToStorage(thoughts);
    }

    deleteThought(id: string): void {
        const thoughts = this.getStoredThoughts();
        const filteredThoughts = thoughts.filter(thought => thought.id !== id);
        this.saveToStorage(filteredThoughts);
    }

    private getStoredThoughts(): Thought[] {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return [];

            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            return parsed.map((thought: Thought) => ({
                ...thought,
                createdAt: new Date(thought.createdAt),
                updatedAt: new Date(thought.updatedAt)
            }));
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    private saveToStorage(thoughts: Thought[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(thoughts));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save thoughts to localStorage');
        }
    }

    // Additional utility methods
    clearAll(): void {
        localStorage.removeItem(this.storageKey);
    }

    getStorageInfo(): { count: number; sizeKB: number } {
        const data = localStorage.getItem(this.storageKey);
        return {
            count: this.getAllThoughts().length,
            sizeKB: data ? Math.round(new Blob([data]).size / 1024) : 0
        };
    }
}