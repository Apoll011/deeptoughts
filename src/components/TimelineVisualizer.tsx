import React, {useEffect, useState} from "react";
import type {CurrentView, Thought, ViewMode} from "../types.ts";
import {CalendarView} from "./CalendarView.tsx";
import {ThoughtCard} from "./ThoughtCard.tsx";
import {Plus} from "lucide-react";
import {Header} from "./Header.tsx";


export const TimelineVisualizer: React.FC<{setSelectedThought: React.Dispatch<React.SetStateAction<Thought | null>>, setCurrentView: React.Dispatch<React.SetStateAction<CurrentView>>}> = ({setSelectedThought, setCurrentView}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [headerVisibility, setHeaderVisibility] = useState(1);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>([]);

    useEffect(() => {
        const controlScrollElements = () => {
            const currentScrollY = window.scrollY;
            const maxScrollForAnimation = 120;

            const newVisibility = Math.max(0, Math.min(1, 1 - (currentScrollY / maxScrollForAnimation)));

            setHeaderVisibility(newVisibility);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlScrollElements);

        return () => {
            window.removeEventListener('scroll', controlScrollElements);
        };
    }, [lastScrollY]);

    const handleThoughtSelect = (thought: Thought) => {
        setSelectedThought(thought);
        setCurrentView('editor');
    };

    return (
        <>
            <Header headerVisibility={headerVisibility} setFilteredThoughts={setFilteredThoughts} viewMode={viewMode} setViewMode={setViewMode}/>

            <div className="pt-54"></div>

            <div className="p-6">
                {viewMode === 'month' && (
                    <CalendarView
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        thoughts={filteredThoughts}
                        onThoughtSelect={handleThoughtSelect}
                    />
                )}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredThoughts.map(thought => (
                            <ThoughtCard
                                key={thought.id}
                                thought={thought}
                                onSelect={handleThoughtSelect}
                            />
                        ))}
                    </div>
                )}
                {viewMode === 'list' && (
                    <div className="space-y-6">
                        {filteredThoughts.map(thought => (
                            <ThoughtCard
                                key={thought.id}
                                thought={thought}
                                onSelect={handleThoughtSelect}
                                compact={true}
                            />
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setCurrentView('mindstream')}
                    className="fixed bottom-10 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-5 rounded-3xl transform hover:scale-110 z-50"
                    style={{
                        transform: `translateY(${(1 - headerVisibility) * 112}px) rotate(${(1 - headerVisibility) * 90}deg)`,
                        opacity: headerVisibility,
                        boxShadow: headerVisibility > 0.5 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                        transition: 'none'
                    }}
                >
                    <Plus className="w-7 h-7"
                          style={{
                              transform: `rotate(${(1 - headerVisibility) * 45}deg)`,
                              transition: 'none'
                          }} />
                </button>
            </div>
        </>

    );
}