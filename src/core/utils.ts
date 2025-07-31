export function generateUUID(): string {
    return crypto.randomUUID();
}

export function sortBlocksByPosition(blocks: any[]): any[] {
    return [...blocks].sort((a, b) => a.position - b.position);
}
