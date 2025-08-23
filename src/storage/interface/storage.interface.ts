import type {Thought} from '../../models/types.ts';

export interface IStorage {
    getThought(id: string): Thought | undefined;
    getAllThoughts(): Thought[];
    saveThought(thought: Thought): void;
    deleteThought(id: string): void;
}