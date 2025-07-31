import React, {useEffect, useState} from "react";
import type {CurrentView, Thought, ViewMode} from "../models/types.ts";
import {CalendarView} from "./CalendarView.tsx";
import {ThoughtCard} from "./Thought/ThoughtCard.tsx";
import {Plus} from "lucide-react";
import {Header} from "./Header.tsx";
import type {ThoughtManager} from "../core/ThoughtManager.ts";
import type {FilterType} from "./FilterPanel.tsx";


export const TimelineVisualizer: React.FC<{manager: ThoughtManager, setSelectedThought: React.Dispatch<React.SetStateAction<Thought | null>>, setCurrentView: React.Dispatch<React.SetStateAction<CurrentView>>}> = ({manager, setSelectedThought, setCurrentView}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [headerVisibility, setHeaderVisibility] = useState(1);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterType>({
        tags: [],
        categories: [],
        favorites: false,
        moods: []
    });

    const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>([]);

    useEffect(() => {
        let thoughts = manager.filterThoughts(filters);

        if (searchQuery.trim() !== '') {
            thoughts = manager.searchThoughtsFromList(searchQuery, thoughts);
        }

        setFilteredThoughts(thoughts);
    }, [searchQuery, filters, manager]);


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
            <Header filters={filters} setFilters={setFilters} thoughts={filteredThoughts} headerVisibility={headerVisibility} viewMode={viewMode} setViewMode={setViewMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

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