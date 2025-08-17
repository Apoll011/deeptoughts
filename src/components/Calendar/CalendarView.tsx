import React, { useMemo, useState } from "react";
import type { Thought } from "../models/types.ts";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    CalendarDays,
    CalendarRange
} from "lucide-react";
import { ThoughtCard } from "./Thought/ThoughtCard.tsx";
import type { ThoughtManager } from "../core/ThoughtManager.ts";

const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
`;

type ViewType = 'day' | 'week' | 'month';

export const CalendarView: React.FC<{
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  thoughts: Thought[];
  onThoughtSelect: (thought: Thought) => void;
  manager: ThoughtManager
}> = ({ selectedDate, onDateChange, thoughts, onThoughtSelect, manager}) => {
  const [viewType, setViewType] = useState<ViewType>('month');

  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const filteredThoughts = thoughts;

  const getThoughtsForDate = (date: Date): Thought[] => {
    return filteredThoughts.filter(thought =>
      thought.createdAt.toDateString() === date.toDateString()
    );
  };

  const navigatePrevious = () => {
    if (viewType === 'day') {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
    } else if (viewType === 'week') {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7));
    } else {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    }
  };

  const navigateNext = () => {
    if (viewType === 'day') {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
    } else if (viewType === 'week') {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7));
    } else {
      onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    }
  };

  const renderDayView = (date: Date | undefined = undefined) => {
    const dateD = date ? date : selectedDate;
    const dayThoughts = getThoughtsForDate(dateD);

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          {dateD.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>

        {dayThoughts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No thoughts for this day
          </div>
        ) : (
          <div className="space-y-3">
            {dayThoughts.map(thought => (
                <ThoughtCard manager={manager} key={thought.id} thought={thought} onSelect={(thought) => onThoughtSelect(thought)} compact={true}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();

            return (
              <div 
                key={index} 
                className={`text-center py-2 cursor-pointer rounded-lg ${
                  isSelected 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white font-bold' 
                    : isToday 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 font-medium' 
                      : 'hover:bg-gray-50'
                }`}
                onClick={() => onDateChange(date)}
              >
                <div className="text-xs mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm font-medium">
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

          {weekDays.map(date => (
              <div>
                  {getThoughtsForDate(date).length > 0 ? renderDayView(date) : ''}
              </div>
          ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayThoughts = getThoughtsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div 
          key={day} 
          className={`h-24 p-1 sm:p-2 border border-gray-100 rounded-lg cursor-pointer ${
            isSelected 
              ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-orange-300 shadow-inner' 
              : isToday 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' 
                : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onDateChange(date);
            setViewType('day');
          }}
        >
          <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-amber-700' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayThoughts.length > 0 ? (
              <>
                {dayThoughts.slice(0, 2).map(thought => (
                  <div
                    key={thought.id}
                    className="bg-white rounded-lg justify-center items-center py-1 px-1 sm:py-2 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border-l-2 border-purple-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onThoughtSelect(thought);
                    }}
                  >
                    <span className="text-xs">{thought.primaryEmotion}</span>
                  </div>
                ))}
                {dayThoughts.length > 2 && (
                  <div className="text-[10px] sm:text-xs text-gray-400 text-center py-0.5">
                    +{dayThoughts.length - 2} more
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity">
                <span className="text-[10px] text-gray-400">No thoughts</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };


  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigatePrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <h2 className="text-xl font-bold text-gray-900">
            {viewType === 'day' 
              ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : viewType === 'week'
                ? `Week of ${new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - selectedDate.getDay()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>

          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setViewType('day')}
            className={`p-1.5 sm:p-2 rounded-lg flex items-center space-x-1 transition-colors ${
              viewType === 'day'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-medium">Day</span>
          </button>

          <button
            onClick={() => setViewType('week')}
            className={`p-1.5 sm:p-2 rounded-lg flex items-center space-x-1 transition-colors ${
              viewType === 'week'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <CalendarRange className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-medium">Week</span>
          </button>

          <button
            onClick={() => setViewType('month')}
            className={`p-1.5 sm:p-2 rounded-lg flex items-center space-x-1 transition-colors ${
              viewType === 'month'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-medium">Month</span>
          </button>
        </div>
      </div>

      <div className="animate-fadeIn bg-white rounded-3xl p-6 shadow-lg">
        {viewType === 'day' && renderDayView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'month' && renderMonthView()}
      </div>
    </>
  );
};