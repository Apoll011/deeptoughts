import type {IStorage} from './storage.interface';
import type {Thought} from '../models/types';
import {mockThoughts} from "./data.ts";

export class InMemoryStorage implements IStorage {
    private thoughts = new Map<string, Thought>();

    constructor() {
        mockThoughts.forEach(thought => {
            this.thoughts.set(thought.id, thought);
        });
    }

    getThought(id: string): Thought | undefined {
        return this.thoughts.get(id);
    }

    getAllThoughts(): Thought[] {
        return Array.from(this.thoughts.values());
    }

    saveThought(thought: Thought): void {
        this.thoughts.set(thought.id, { ...thought, updatedAt: new Date() });
    }

    deleteThought(id: string): void {
        this.thoughts.delete(id);
    }
}
