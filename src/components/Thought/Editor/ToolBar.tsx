import React, {useEffect, useRef, useState} from "react";
import {Camera, Heart, Image, MapPin, Music, Plus, Type, Video} from "lucide-react";
import type {blockType, mediaType} from "../../../types.ts";

export const ToolBar: React.FC<{
    add: (type: blockType, subType?: mediaType) => void,
}> = ({add}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    const [showMediaMenu, setShowMediaMenu] = useState(false);
    const longPressTimer = useRef<number | null>(null);
    const longPressDelay = 500;

    const blockTypes = [
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

    const handleMediaRelease = (e: { type: string; }) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (!showMediaMenu && (e.type === 'mouseup' || e.type === 'touchend')) {
            addBlock('media');
        }
    };

    const handleMediaClick = () => {
        if (!showMediaMenu) {
            addBlock('media');
        }
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
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    {showMediaMenu && (
                        <div className="absolute bottom-full right-0 mb-4">
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-2
                          animate-in slide-in-from-bottom-4 duration-300">
                                <div className="flex space-x-1">
                                    {mediaOptions.map((option, index) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => addBlock('media', option.id as mediaType)}
                                                className="group flex flex-col items-center p-3 rounded-xl hover:bg-gray-50
                               transition-all duration-200 hover:scale-105 min-w-[60px]"
                                                style={{
                                                    animationDelay: `${index * 50}ms`
                                                }}
                                            >
                                                <IconComponent className={`w-5 h-5 ${option.color} group-hover:scale-110 
                                               transition-transform duration-200`}/>
                                                <span
                                                    className="text-xs font-medium text-gray-700 mt-1">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Arrow pointing down */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2
                            border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"/>
                            </div>
                        </div>
                    )}

                    <div className={`
          bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isExpanded
            ? 'w-76 h-20'
            : 'w-16 h-16'
          }
          transform origin-right
          flex items-center justify-end
        `}>

                        <div className={`
            absolute right-3 top-3 w-10 h-10 flex items-center justify-center
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isExpanded ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
          `}>
                            <button
                                onClick={handleExpand}
                                className="group w-full h-full rounded-full hover:bg-gray-50
                       transition-all duration-300 flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5 text-gray-700 group-hover:text-gray-900
                             group-hover:rotate-45 transition-all duration-300"/>
                            </button>
                        </div>

                        <div className={`
            flex items-center justify-center w-full h-full
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isExpanded
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4 pointer-events-none'
            }
          `}>

                            <div className="flex items-center">
                                {blockTypes.map((block, index) => {
                                    const IconComponent = block.icon;
                                    const isActive = activeBlock === block.id ||
                                        (block.id === 'media' && mediaOptions.some(opt => activeBlock === opt.label));
                                    const isMediaBlock = block.id === 'media';

                                    return (
                                        <div key={block.id} className="relative group">
                                            <button
                                                onClick={() => isMediaBlock ? handleMediaClick() : addBlock(block.id as blockType)}
                                                onMouseDown={isMediaBlock ? handleMediaPress : undefined}
                                                onMouseUp={isMediaBlock ? handleMediaRelease : undefined}
                                                onTouchStart={isMediaBlock ? handleMediaPress : undefined}
                                                onTouchEnd={isMediaBlock ? handleMediaRelease : undefined}
                                                disabled={isActive}
                                                className={`
                        relative flex flex-col items-center justify-center p-3 rounded-xl
                        w-16 h-14 transition-all duration-300
                        ${isActive
                                                    ? 'bg-gray-900 text-white scale-95'
                                                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:scale-105'
                                                }
                        ${isMediaBlock && showMediaMenu ? 'bg-blue-50 text-blue-600' : ''}
                      `}
                                                style={{
                                                    transitionDelay: isExpanded ? `${index * 50 + 200}ms` : '0ms'
                                                }}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-xl bg-gray-900">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl
                                        animate-pulse"/>
                                                    </div>
                                                )}

                                                <div className="relative z-10 flex flex-col items-center space-y-1">
                                                    <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                                                        isActive ? 'scale-110' : 'group-hover:scale-110'
                                                    }`}/>
                                                    <span className="text-xs font-medium">{block.label}</span>
                                                </div>
                                            </button>

                                            <div className={`
                      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2                     px-2 py-1 bg-gray-900 text-white text-xs rounded-md
                      opacity-0 group-hover:opacity-100 transition-all duration-200
                      pointer-events-none whitespace-nowrap
                      group-hover:translate-y-0 translate-y-1
                    `}>
                                                {isMediaBlock ? 'Tap or hold for options' : block.description}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2
                                    border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {(isExpanded || showMediaMenu) && (
                <div className="fixed inset-0 z-10" onClick={() => {
                    handleCollapse();
                    setShowMediaMenu(false);
                }}/>
            )}
        </>

    );
};