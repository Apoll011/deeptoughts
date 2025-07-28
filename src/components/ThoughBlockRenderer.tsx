import React, { useState, useMemo } from 'react';
import {LocationBlock} from "./LocationBlock.tsx";
import type {ThoughtBlock} from "../types.ts";
import {ImageBlock} from "./ImageBlock.tsx";
import {VideoBlock} from "./VideoBlock.tsx";
import {MoodBlock} from "./MoodBlock.tsx";
import {AudioPlayer} from "./AudioPlayer.tsx";

interface ThoughtBlockRendererProps {
    block: ThoughtBlock;
    className?: string;
    showTimestamp?: boolean;
    isSelected?: boolean;
    onBlockClick?: (block: ThoughtBlock) => void;
    onBlockLongPress?: (block: ThoughtBlock) => void;
}

const TextBlock: React.FC<{ content: string; timestamp?: Date }> = ({ content, timestamp }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = content.length > 300;

    const displayContent = useMemo(() => {
        if (!isLongText || isExpanded) return content;
        return content.substring(0, 300) + '...';
    }, [content, isLongText, isExpanded]);

    const formatText = (text: string) => {
        return text
            .split(/(\s+)/)
            .map((word, index) => {
                // URL detection
                if (word.match(/^https?:\/\/[^\s]+$/)) {
                    return (
                        <a
                            key={index}
                            href={word}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {word}
                        </a>
                    );
                }
                if (word.match(/^#[a-zA-Z0-9_]+$/)) {
                    return (
                        <span key={index} className="text-blue-500 font-medium">
                            {word}
                        </span>
                    );
                }
                if (word.match(/^@[a-zA-Z0-9_]+$/)) {
                    return (
                        <span key={index} className="text-purple-600 font-medium">
                            {word}
                        </span>
                    );
                }
                return word;
            });
    };

    return (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="prose prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed text-base m-0 whitespace-pre-wrap">
                    {formatText(displayContent)}
                </p>
            </div>

            {isLongText && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                >
                    <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

            {timestamp && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <time className="text-xs text-gray-500">
                        {timestamp.toLocaleString()}
                    </time>
                </div>
            )}
        </div>
    );
};


export const ThoughtBlockRenderer: React.FC<ThoughtBlockRendererProps> = ({
                                                                              block,
                                                                              className = '',
                                                                              showTimestamp = false,
                                                                              isSelected = false,
                                                                              onBlockClick,
                                                                              onBlockLongPress
                                                                          }) => {
    const [isLongPressing, setIsLongPressing] = useState(false);
    let longPressTimer: ReturnType<typeof setTimeout>;

    const handleMouseDown = () => {
        longPressTimer = setTimeout(() => {
            setIsLongPressing(true);
            onBlockLongPress?.(block);
        }, 500);
    };

    const handleMouseUp = () => {
        clearTimeout(longPressTimer);
        if (!isLongPressing) {
            onBlockClick?.(block);
        }
        setIsLongPressing(false);
    };

    const handleMouseLeave = () => {
        clearTimeout(longPressTimer);
        setIsLongPressing(false);
    };

    const getBlockTypeIcon = (type: string) => {
        switch (type) {
            case 'text':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                );
            case 'media':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'location':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                );
            case 'mood':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`
                relative group transition-all duration-200 
                ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                ${onBlockClick ? 'cursor-pointer' : ''}
                ${className}
            `}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            data-block-id={block.id}
            data-block-position={block.position}
        >
            <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    {getBlockTypeIcon(block.type)}
                </div>
            </div>

            <div className="relative">
                {block.type === 'text' && (
                    <TextBlock
                        content={block.content}
                        timestamp={showTimestamp ? block.timestamp : undefined}
                    />
                )}

                {block.type === 'media' && block.media && (
                    <div className="my-2">
                        {block.media.type === 'image' && (
                            <ImageBlock media={block.media} />
                        )}
                        {block.media.type === 'video' && (
                            <VideoBlock media={block.media} />
                        )}
                        {block.media.type === 'audio' && (
                            <AudioPlayer media={block.media} />
                        )}
                    </div>
                )}

                {block.type === 'location' && block.location && (
                    <LocationBlock location={block.location} />
                )}

                {block.type === 'mood' && block.mood && (
                    <MoodBlock mood={block.mood} />
                )}

                {block.content && block.type !== 'text' && block.type !== 'media' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{block.content}</p>
                    </div>
                )}
            </div>

            {isSelected && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-20 rounded-xl pointer-events-none" />
            )}

            {isLongPressing && (
                <div className="absolute inset-0 bg-purple-100 bg-opacity-30 rounded-xl animate-pulse" />
            )}
        </div>
    );
};