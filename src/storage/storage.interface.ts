import type {Thought} from '../models/types';

export interface IStorage {
    getThought(id: string): Thought | undefined;
    getAllThoughts(): Thought[];
    saveThought(thought: Thought): void;
    deleteThought(id: string): void;
}
