import React, {type ElementType, useEffect, useRef, useState} from "react";
import {Camera, ChevronLeft, Heart, Image, MapPin, Music, Plus, Save, Type, Video} from "lucide-react";
import type {blockType, mediaType} from "../../../models/types.ts";

export const ToolBar: React.FC<{
    add: (type: blockType, subType?: mediaType) => void,
    back: () => void,
    handleSave: () => void,
    isDirty: boolean,
}> = ({add, back, handleSave, isDirty}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    const [showMediaMenu, setShowMediaMenu] = useState(false);
    const longPressTimer = useRef<number | null>(null);
    const longPressDelay = 500;

    // Scroll hide/show state
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;
            // Small threshold to avoid jitter
            if (delta > 4) {
                // Scrolling down -> hide toolbar
                setIsHidden(true);
            } else if (delta < -4) {
                // Scrolling up -> show toolbar
                setIsHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const blockTypes: {id: blockType, icon: ElementType, label: string, description: string}[] = [
        {
            id: 'text',
            icon: Type,
            label: 'Text',
            description: 'Add rich text content'
        },
        {
            id: 'media',
            icon: Image,
            label: 'Media',
            description: 'Upload media content'
        },
        {
            id: 'location',
            icon: MapPin,
            label: 'Location',
            description: 'Share your location'
        },
        {
            id: 'mood',
            icon: Heart,
            label: 'Mood',
            description: 'Express how you feel'
        }
    ];

    const mediaOptions = [
        {id: 'image', icon: Camera, label: 'Photo', color: 'text-blue-600'},
        {id: 'video', icon: Video, label: 'Video', color: 'text-red-600'},
        {id: 'audio', icon: Music, label: 'Audio', color: 'text-green-600'}
    ];

    const addBlock = (type: blockType, subType: mediaType | null = null) => {
        const blockName = subType ? `${subType}` : type;
        setActiveBlock(blockName);
        setShowMediaMenu(false);
        setTimeout(() => {
            setActiveBlock(null);
            handleCollapse();
        }, 300);
        add(type, subType ? subType : undefined);
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setShowMediaMenu(false);
    };

    const handleMediaPress = (e: { type: string; }) => {
        if (e.type === 'mousedown' || e.type === 'touchstart') {
            longPressTimer.current = setTimeout(() => {
                setShowMediaMenu(true);
            }, longPressDelay);
        }
    };

    const handleMediaRelease = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        // Do not add default media on short press; menu will be opened by click or long-press
    };

    const handleMediaClick = () => {
        // On normal click, open the media type menu instead of adding default media
        setShowMediaMenu(true);
    };

    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    return (
        <>
            <div className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-transform duration-500 ease-out ${isHidden ? 'translate-y-[160%] bottom-0' : 'translate-y-0 bottom-6'}`}>
                <div className={` relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'w-80 h-20 rounded-full overflow-hidden' : 'w-80 h-16 rounded-full overflow-visible'} bg-white backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 transform origin-center`}>
                    <div className={`absolute inset-0 flex items-center justify-between px-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}>
                        <button
                            onClick={back}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        <div className="relative -my-2">
                            <button
                                onClick={handleExpand}
                                className="w-18 h-18 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border  transition-all duration-300 flex items-center justify-center group shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]"
                            >
                                <Plus className="w-8 h-8 text-white/80 group-hover:rotate-45 transition-all duration-300" />
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!isDirty}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                    </div>

                    <div className={` absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                        <div className="flex items-center gap-2 px-4">
                            {blockTypes.map((block, index) => {
                                const IconComponent = block.icon;
                                const isActive = activeBlock === block.id ||
                                    (block.id === 'media' && mediaOptions.some(opt => activeBlock === opt.label));
                                const isMediaBlock = block.id === 'media';

                                return (
                                    <div key={block.id} className="relative">
                                        <button
                                            onClick={() => isMediaBlock ? handleMediaClick() : addBlock(block.id)}
                                            onMouseDown={isMediaBlock ? handleMediaPress : undefined}
                                            onMouseUp={isMediaBlock ? handleMediaRelease : undefined}
                                            onTouchStart={isMediaBlock ? handleMediaPress : undefined}
                                            onTouchEnd={isMediaBlock ? handleMediaRelease : undefined}
                                            disabled={isActive}
                                            className={` relative flex flex-col items-center justify-center  w-16 h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-gray-900 text-white scale-95' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:scale-105'} ${isMediaBlock && showMediaMenu ? 'bg-blue-50 text-blue-600' : ''}`}
                                            style={{
                                                transitionDelay: isExpanded ? `${index * 50 + 200}ms` : '0ms'
                                            }}
                                        >
                                            <div className={`relative z-10 flex flex-col items-center gap-1 ${isActive ? ' absolute inset-0 rounded-xl h-15 w-15 pt-2 items-center  bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse text-white' : ''}`}>
                                                <IconComponent className={`w-4 h-4 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                                                <span className="text-xs font-medium">{block.label}</span>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {showMediaMenu && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 p-2 animate-in slide-in-from-bottom-4 duration-200">
                            <div className="flex space-x-1">
                                {mediaOptions.map((option, index) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => addBlock('media', option.id as mediaType)}
                                            className="group flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 min-w-[60px]"
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            <IconComponent className={`w-5 h-5 ${option.color} group-hover:scale-110 transition-transform duration-200`} />
                                            <span className="text-xs font-medium text-gray-700 mt-1">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Arrow pointing down to the media icon */}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/95" />
                        </div>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={handleCollapse}
                />
            )}
        </>
    );
};