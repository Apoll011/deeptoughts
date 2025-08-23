import type {Thought, ThoughtBlock} from '../models/types';
import {fileURL} from "./db.ts";

class MediaUrlValidator {
    private urlValidityCache = new Map<string, boolean>();

    private isUrlValid(url: string): boolean {
        if (this.urlValidityCache.has(url)) {
            return this.urlValidityCache.get(url)!;
        }

        try {
            if (url.startsWith('blob:')) {
                const isValid = this.testBlobUrl(url);
                this.urlValidityCache.set(url, isValid);
                return isValid;
            }

            new URL(url);
            this.urlValidityCache.set(url, true);
            return true;
        } catch (error) {
            this.urlValidityCache.set(url, false);
            return false;
        }
    }

    private testBlobUrl(url: string): boolean {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10); // 10ms timeout

            fetch(url, {
                method: 'HEAD',
                signal: controller.signal
            }).catch(() => {});

            return true;
        } catch (error) {
            return false;
        }
    }

    private validateMediaBlock(block: ThoughtBlock): ThoughtBlock {
        if (!block.media?.url) return block;

        if (this.isUrlValid(block.media.url)) {
            return block;
        }

        try {
            const newUrl = fileURL(block.id);
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

    validateAndFixMediaUrls(thought: Thought): Thought {
        const updatedBlocks = thought.blocks.map(block => {
            if (block.type === 'media' && block.media?.url) {
                return this.validateMediaBlock(block);
            }
            return block;
        });

        return {
            ...thought,
            blocks: updatedBlocks
        };
    }

    clearCache(): void {
        this.urlValidityCache.clear();
    }
}

const mediaUrlValidator = new MediaUrlValidator();

export const validateAndFixMediaUrls = (thought: Thought): Thought => {
    return mediaUrlValidator.validateAndFixMediaUrls(thought);
};

export const clearMediaUrlCache = (): void => {
    mediaUrlValidator.clearCache();
};