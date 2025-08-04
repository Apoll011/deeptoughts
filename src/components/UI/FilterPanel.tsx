import React, { useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Tag, Heart, SlidersHorizontal } from "lucide-react";
import type { Thought } from "../../models/types.ts";

export type FilterType = {
  tags: string[];
  categories: string[];
  favorites: boolean;
  moods: string[];
};

interface FilterPanelProps {
  thoughts: Thought[];
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  thoughts,
  filters,
  setFilters,
  showFilters,
  setShowFilters
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showFilters && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty('--filter-button-height', `${rect.height}px`);
      document.documentElement.style.setProperty('--filter-button-top', `${rect.top}px`);
      document.documentElement.style.setProperty('--filter-button-right', `${window.innerWidth - rect.right}px`);
    }
  }, [showFilters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilters && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target as Node) && 
          panelRef.current && 
          !panelRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters, setShowFilters]);

  useEffect(() => {
    const handleResize = () => {
      if (showFilters && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        document.documentElement.style.setProperty('--filter-button-height', `${rect.height}px`);
        document.documentElement.style.setProperty('--filter-button-top', `${rect.top}px`);
        document.documentElement.style.setProperty('--filter-button-right', `${window.innerWidth - rect.right}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showFilters]);
  const allTags = useMemo(() =>
    [...new Set(thoughts.flatMap(thought => thought.tags))],
    [thoughts]
  );

  const allCategories = useMemo(() => 
    [...new Set(thoughts.map(thought => thought.category))],
    [thoughts]
  );

  const allMoods = useMemo(() => 
    [...new Set(thoughts.map(thought => thought.mood))],
    [thoughts]
  );

  const toggleFilter = (type: keyof FilterType, value: string) => {
    setFilters(prev => {
      if (type === 'favorites') {
        return { ...prev, favorites: !prev.favorites };
      }

      const array = [...prev[type]];
      const index = array.indexOf(value);

      if (index === -1) {
        array.push(value);
      } else {
        array.splice(index, 1);
      }

      return { ...prev, [type]: array };
    });
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      categories: [],
      favorites: false,
      moods: []
    });
  };

  const FilterButton: React.FC = () => {
    const hasActiveFilters = Object.values(filters).some(val => 
      Array.isArray(val) ? val.length > 0 : val
    );

    return (
      <button
        ref={buttonRef}
        onClick={() => setShowFilters(!showFilters)}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm hover:shadow ${
          showFilters || hasActiveFilters
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium">Filters</span>

        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 bg-white text-purple-700 text-xs font-bold rounded-full shadow-sm">
            {filters.tags.length + filters.categories.length + filters.moods.length + (filters.favorites ? 1 : 0)}
          </span>
        )}
      </button>
    );
  };

  if (!showFilters) {
    return <FilterButton />;
  }

  return (
    <div className="animate-fadeIn relative">
      <FilterButton />

      {showFilters && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fadeIn"
            onClick={() => setShowFilters(false)}
          />

          <div
            ref={panelRef} 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-gray-100 w-80 max-w-[90vw] max-h-[90vh] overflow-auto animate-scaleIn no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800 text-lg">Filters</h3>
                {Object.values(filters).some(val => 
                  Array.isArray(val) ? val.length > 0 : val
                ) && (
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                    {filters.tags.length + filters.categories.length + filters.moods.length + (filters.favorites ? 1 : 0)} active
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-gray-700 mb-2 flex items-center font-medium">
                <span className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mr-2"></span>
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleFilter('categories', category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all shadow-sm hover:shadow ${
                      filters.categories.includes(category)
                        ? category === 'Family'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                          : category === 'Nature'
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-gray-700 mb-2 flex items-center font-medium">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full mr-2"></span>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter('tags', tag)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs transition-all shadow-sm hover:shadow ${
                      filters.tags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-gray-700 mb-2 flex items-center font-medium">
                <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full mr-2"></span>
                Moods
              </h4>
              <div className="flex flex-wrap gap-2">
                {allMoods.map(mood => (
                  <button
                    key={mood}
                    onClick={() => toggleFilter('moods', mood)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all shadow-sm hover:shadow ${
                      filters.moods.includes(mood)
                        ? 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => toggleFilter('favorites', '')}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow ${
                  filters.favorites
                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${filters.favorites ? 'fill-current' : ''}`} />
                <span>Favorites only</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
