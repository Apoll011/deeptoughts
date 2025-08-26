import React, {useEffect, useRef, useState} from "react";
import type {CurrentView, Thought, ViewMode} from "../models/types.ts";
import {CalendarView} from "./Calendar/CalendarView.tsx";
import {ThoughtCard} from "./Thought/ThoughtCard.tsx";
import {Plus} from "lucide-react";
import {Header} from "./UI/Header.tsx";
import type {FilterType} from "./UI/FilterPanel.tsx";
import {useAppContext} from "../context/AppContext.tsx";
import {motion} from "framer-motion";


export const Home: React.FC<{ setSelectedThought: React.Dispatch<React.SetStateAction<Thought | null>>, setCurrentView: React.Dispatch<React.SetStateAction<CurrentView>>, startNewThought: () => void, thoughts: Thought[]}> = ({setSelectedThought, setCurrentView, startNewThought, thoughts}) => {
    const { manager } = useAppContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [headerVisibility, setHeaderVisibility] = useState(1);
    const lastScrollYRef = useRef(0);
    const [isUIVisible, setIsUIVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterType>({
        tags: [],
        categories: [],
        favorites: false,
        moods: []
    });

    const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>(thoughts);

    useEffect(() => {
        let filtered = manager.filterThoughts(filters);

        if (searchQuery.trim() !== '') {
            filtered = manager.searchThoughtsFromList(searchQuery, filtered);
        }

        setFilteredThoughts(filtered);
    }, [searchQuery, filters, thoughts, manager]);


    useEffect(() => {
        const threshold = 6; // pixels to avoid jitter
        const onScroll = () => {
            const current = window.scrollY;
            const last = lastScrollYRef.current || 0;
            const delta = current - last;

            // Always show near top
            if (current < 10) {
                setIsUIVisible(true);
                setHeaderVisibility(1);
            } else if (delta > threshold) {
                // Scrolling down
                setIsUIVisible(false);
                setHeaderVisibility(0);
            } else if (delta < -threshold) {
                // Scrolling up
                setIsUIVisible(true);
                setHeaderVisibility(1);
            }

            lastScrollYRef.current = current;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleThoughtSelect = (thought: Thought) => {
        setSelectedThought(thought);
        setCurrentView('editor');
    };

    const NoThoughtsMessage = () => (
        <div className="text-center py-20 text-gray-500">
            <h3 className="text-lg font-semibold">No Thoughts Found</h3>
            <p className="mt-2">
                {thoughts.length === 0
                    ? "You haven't created any thoughts yet. Tap the '+' button to start."
                    : "Try adjusting your search or filters."
                }
            </p>
        </div>
    );

    return (
        <>
            <Header
                filters={filters}
                setFilters={setFilters}
                thoughts={filteredThoughts}
                headerVisibility={headerVisibility}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

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
                    filteredThoughts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredThoughts.map(thought => (
                                <ThoughtCard
                                    key={thought.id}
                                    thought={thought}
                                    onSelect={handleThoughtSelect}
                                />
                            ))}
                        </div>
                    ) : <NoThoughtsMessage />
                )}
                {viewMode === 'list' && (
                    filteredThoughts.length > 0 ? (
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
                    ) : <NoThoughtsMessage />
                )}
                <motion.button
                    onClick={startNewThought}
                    className="fixed bottom-10 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-5 rounded-3xl z-50"
                    initial={false}
                    animate={isUIVisible ? { y: 0, rotate: 0, opacity: 1, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' } : { y: 112, rotate: 90, opacity: 0, boxShadow: 'none' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.span
                        animate={isUIVisible ? { rotate: 0 } : { rotate: 45 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                        className="flex"
                    >
                        <Plus className="w-7 h-7" />
                    </motion.span>
                </motion.button>
            </div>
        </>

    );
}