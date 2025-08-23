import type {IStorage} from './storage.interface';
import type {Thought} from '../models/types';
import {fileURL} from "./db.ts";

export class LocalStorageThoughts implements IStorage {
    private readonly storageKey = 'thoughts-storage';
    private thoughtsCache: Thought[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_DURATION = 10000;

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
        if (this.thoughtsCache && (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION) {
            return this.thoughtsCache;
        }

        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                this.thoughtsCache = [];
                this.cacheTimestamp = Date.now();
                return [];
            }

            const parsed = JSON.parse(stored);
            const thoughts = parsed.map((thought: Thought) => ({
                ...thought,
                createdAt: new Date(thought.createdAt),
                updatedAt: new Date(thought.updatedAt)
            }));

            this.thoughtsCache = thoughts;
            this.cacheTimestamp = Date.now();

            return thoughts;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            const emptyResult: Thought[] = [];
            this.thoughtsCache = emptyResult;
            this.cacheTimestamp = Date.now();
            return emptyResult;
        }
    }

    private saveToStorage(thoughts: Thought[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(thoughts));
            this.thoughtsCache = thoughts;
            this.cacheTimestamp = Date.now();
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save thoughts to localStorage');
        }
    }

    clearAll(): void {
        localStorage.removeItem(this.storageKey);
        this.thoughtsCache = null;
        this.cacheTimestamp = 0;
    }

    getStorageInfo(): { count: number; sizeKB: number } {
        const data = localStorage.getItem(this.storageKey);
        return {
            count: this.getAllThoughts().length,
            sizeKB: data ? Math.round(new Blob([data]).size / 1024) : 0
        };
    }

    async refreshAllMediaUrls(): Promise<void> {
        const thoughts = this.getStoredThoughts();
        const updatedThoughts: Thought[] = await Promise.all(
            thoughts.map(async thought => {
                const updatedBlocks = await Promise.all(
                    thought.blocks.map(async block => {
                        if (block.type === 'media' && block.media?.url) {
                            try {
                                const newUrl = await fileURL(block.id);
                                return {
                                    ...block,
                                    media: {
                                        ...block.media,
                                        url: newUrl
                                    }
                                };
                            } catch (error) {
                                console.warn(`Failed to refresh URL for block ${block.id}:`, error);
                                return block;
                            }
                        }
                        return block;
                    })
                );

                return {
                    ...thought,
                    blocks: updatedBlocks
                };
            })
        );

        this.saveToStorage(updatedThoughts);
    }
}