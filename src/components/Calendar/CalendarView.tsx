import React, { useMemo, useState } from "react";
import type { Thought } from "../../models/types.ts";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { ThoughtCard } from "../Thought/ThoughtCard.tsx";

type ViewType = 'day' | 'week' | 'month';

export const CalendarView: React.FC<{
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    thoughts: Thought[];
    onThoughtSelect: (thought: Thought) => void;
}> = ({ selectedDate, onDateChange, thoughts, onThoughtSelect }) => {
    const [viewType, setViewType] = useState<ViewType>('month');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thoughtsByDate = useMemo(() => {
        const map = new Map<string, Thought[]>();
        thoughts.forEach(thought => {
            const thoughtDate = new Date(thought.createdAt);
            thoughtDate.setHours(0, 0, 0, 0);
            const dateStr = thoughtDate.toDateString();
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(thought);
        });
        return map;
    }, [thoughts]);

    const getThoughtsForDate = (date: Date): Thought[] => {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return thoughtsByDate.get(checkDate.toDateString()) || [];
    };

    const navigatePrevious = () => {
        const newDate = new Date(selectedDate);
        if (viewType === 'day') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
            newDate.setDate(1);
        }
        onDateChange(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(selectedDate);
        if (viewType === 'day') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
            newDate.setDate(1);
        }
        onDateChange(newDate);
    };

    const renderThoughtsForDate = (date: Date) => {
        const dayThoughts = getThoughtsForDate(date);
        return (
            <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 px-1">
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h3>
                {dayThoughts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl mt-2">
                        <p>No thoughts recorded.</p>
                        <p className="text-sm text-gray-400">A blank canvas for your reflections.</p>
                    </div>
                ) : (
                    <div className="space-y-3 mt-2">
                        {dayThoughts.map(thought => (
                            <ThoughtCard key={thought.id} thought={thought} onSelect={onThoughtSelect}
                                         compact={true}/>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const renderDayView = () => {
        return (
            <div>
                {renderThoughtsForDate(selectedDate)}
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        const weekHasThoughts = weekDays.some(date => getThoughtsForDate(date).length > 0);

        return (
            <div>
                <div className="mt-6 space-y-6">
                    {weekHasThoughts ? (
                        weekDays.map(date => {
                            const thoughts = getThoughtsForDate(date);
                            if (thoughts.length > 0) {
                                return (
                                    <div key={date.toISOString()}>
                                        <h3 className="text-lg font-bold text-gray-800 px-1 mb-2">
                                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <div className="space-y-3">
                                            {thoughts.map(thought => (
                                                <ThoughtCard key={thought.id} thought={thought} onSelect={onThoughtSelect}
                                                             compact={true}/>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl mt-2">
                            <p>No thoughts recorded for this week.</p>
                            <p className="text-sm text-gray-400">A fresh start, a new week to capture your moments.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();

        const monthDays = Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(firstDay);
            date.setDate(firstDay.getDate() + i);
            return date;
        });

        const monthHasThoughts = monthDays.some(date => getThoughtsForDate(date).length > 0);

        return (
            <div>
                <div className="mt-6 space-y-6">
                    {monthHasThoughts ? (
                        monthDays.map(date => {
                            const thoughts = getThoughtsForDate(date);
                            if (thoughts.length > 0) {
                                return (
                                    <div key={date.toISOString()}>
                                        <h3 className="text-lg font-bold text-gray-800 px-1 mb-2">
                                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <div className="space-y-3">
                                            {thoughts.map(thought => (
                                                <ThoughtCard key={thought.id} thought={thought} onSelect={onThoughtSelect}
                                                             compact={true}/>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl mt-2">
                            <p>No thoughts recorded for this Month.</p>
                            <p className="text-sm text-gray-400">A fresh start, a new month to capture your moments.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const viewTitle = useMemo(() => {
        if (viewType === 'day') {
            return selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
        if (viewType === 'week') {
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} ${startOfWeek.toLocaleDateString('en-US', { day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { day: 'numeric' })}, ${startOfWeek.getFullYear()}`;
            }
            return `${startOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${startOfWeek.toLocaleDateString('en-US', { day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', {
                month: 'short'
            })} ${endOfWeek.toLocaleDateString('en-US', { day: 'numeric' })}, ${endOfWeek.getFullYear()}`;
        }
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [selectedDate, viewType]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-gray-900 w-44 text-center">
                    {viewTitle}
                </h2>
                <div className="flex items-center">
                    <button
                        onClick={navigatePrevious}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600"/>
                    </button>
                    <button
                        onClick={navigateNext}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600"/>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center bg-gray-100 p-1 rounded-full mb-6">
                {(['day', 'week', 'month'] as ViewType[]).map(v => (
                    <button
                        key={v}
                        onClick={() => setViewType(v)}
                        className={`w-full py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                            viewType === v
                                ? 'bg-white text-gray-800 shadow'
                                : 'bg-transparent text-gray-500'
                        }`}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex-grow overflow-y-auto pb-20">
                <div className="bg-white rounded-3xl p-4 shadow-sm">
                    {viewType === 'day' && renderDayView()}
                    {viewType === 'week' && renderWeekView()}
                    {viewType === 'month' && renderMonthView()}
                </div>
            </div>
        </div>
    );
};