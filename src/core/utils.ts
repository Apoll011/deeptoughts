import type {ThoughtBlock} from "../models/types.ts";

export function generateUUID(): string {
    return crypto.randomUUID();
}

export function sortBlocksByPosition(blocks: ThoughtBlock[]): ThoughtBlock[] {
    return [...blocks].sort((a, b) => a.position - b.position);
}
