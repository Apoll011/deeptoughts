import React from "react";
import type {Thought} from "../types.ts";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const CalendarView: React.FC<{
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    thoughts: Thought[];
    onThoughtSelect: (thought: Thought) => void;
}> = ({ selectedDate, onDateChange, thoughts, onThoughtSelect }) => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const getThoughtsForDate = (date: Date): Thought[] => {
        return thoughts.filter(thought =>
            thought.createdAt.toDateString() === date.toDateString()
        );
    };

    const days = [];

    // Empty cells for days before month start
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayThoughts = getThoughtsForDate(date);
        const isToday = date.toDateString() === today.toDateString();

        days.push(
            <div key={day} className={`h-24 p-2 border border-gray-100 rounded-lg ${
                isToday ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : 'hover:bg-gray-50'
            }`}>
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-amber-700' : 'text-gray-700'}`}>
                    {day}
                </div>
                <div className="space-y-1">
                    {dayThoughts.slice(0, 2).map(thought => (
                        <div
                            key={thought.id}
                            className="bg-white rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border-l-2 border-purple-300"
                            onClick={() => onThoughtSelect(thought)}
                        >
                            <div className="flex items-center space-x-1">
                                <span className="text-xs">{thought.primaryEmotion}</span>
                                <span className="text-xs text-gray-700 truncate flex-1 font-medium">
                  {thought.title}
                </span>
                            </div>
                        </div>
                    ))}
                    {dayThoughts.length > 2 && (
                        <div className="text-xs text-gray-400 text-center py-1">
                            +{dayThoughts.length - 2} more
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>
        </div>
    );
};