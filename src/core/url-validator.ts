import type {Thought, ThoughtBlock} from '../models/types';
import {fileURL} from "../storage/db.ts";

class MediaUrlValidator {
    private urlCache = new Map<string, string>(); // Changed to store blockId -> url mapping

    private async getOrGenerateUrl(blockId: string): Promise<string> {
        if (this.urlCache.has(blockId)) {
            return this.urlCache.get(blockId)!;
        }

        try {
            const newUrl = await fileURL(blockId);
            this.urlCache.set(blockId, newUrl);
            return newUrl;
        } catch (error) {
            console.warn(`Failed to generate URL for block ${blockId}:`, error);
            throw error;
        }
    }

    async fixBlockMediaUrl(block: ThoughtBlock): Promise<ThoughtBlock> {
        if (!block.media?.url) return block;
        try {
            const newUrl = await this.getOrGenerateUrl(block.id);
            return {
                ...block,
                media: {
                    ...block.media,
                    url: newUrl
                }
            };
        } catch (error) {
            console.warn(`Failed to regenerate URL for block ${block.id}:`, error);
            return block;
        }
    }

    async validateMediaBlock(block: ThoughtBlock): Promise<ThoughtBlock> {
        if (!block.media?.url) return block;

        try {
            const url = await this.getOrGenerateUrl(block.id);
            return {
                ...block,
                media: {
                    ...block.media,
                    url: url
                }
            };
        } catch (error) {
            return block;
        }
    }

    async validateAndFixMediaUrls(thought: Thought): Promise<Thought> {
        const updatedBlocks = await Promise.all(
            thought.blocks.map(async block => {
                if (block.type === 'media' && block.media?.url) {
                    return await this.validateMediaBlock(block);
                }
                return block;
            })
        );

        return {
            ...thought,
            blocks: updatedBlocks
        };
    }

    clearCache(): void {
        this.urlCache.clear();
    }
}

const mediaUrlValidator = new MediaUrlValidator();

export const validateAndFixMediaUrls = async (thought: Thought): Promise<Thought> => {
    return await mediaUrlValidator.validateAndFixMediaUrls(thought);
};

export const validateMediaBlock = async (block: ThoughtBlock): Promise<ThoughtBlock> => {
    return await mediaUrlValidator.validateMediaBlock(block);
};

export const clearMediaUrlCache = (): void => {
    mediaUrlValidator.clearCache();
};