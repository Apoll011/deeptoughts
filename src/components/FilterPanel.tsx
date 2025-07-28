import React, { useMemo } from "react";
import { X, Tag, Heart, SlidersHorizontal } from "lucide-react";
import type { Thought } from "../types.ts";

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

  const FilterButton: React.FC = () => (
    <button
      onClick={() => setShowFilters(!showFilters)}
      className={`p-1.5 sm:p-2 rounded-lg flex items-center space-x-1 transition-colors ${
        showFilters || Object.values(filters).some(val => 
          Array.isArray(val) ? val.length > 0 : val
        )
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="text-[10px] sm:text-xs font-medium">Filter</span>

      {Object.values(filters).some(val => 
        Array.isArray(val) ? val.length > 0 : val
      ) && (
        <span className="flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 bg-purple-600 text-white text-[8px] sm:text-xs rounded-full">
          {filters.tags.length + filters.categories.length + filters.moods.length + (filters.favorites ? 1 : 0)}
        </span>
      )}
    </button>
  );

  if (!showFilters) {
    return <FilterButton />;
  }

  return (
    <div className="animate-fadeIn relative">
      <FilterButton />

      <div className="absolute right-0 z-50 bg-white rounded-xl shadow-md p-3 sm:p-4 mt-2 border border-gray-100 w-72">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-800">Filters</h3>
            {Object.values(filters).some(val => 
              Array.isArray(val) ? val.length > 0 : val
            ) && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                {filters.tags.length + filters.categories.length + filters.moods.length + (filters.favorites ? 1 : 0)} active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories filter */}
        <div className="mb-3">
          <h4 className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
            <span className="w-2 h-2 bg-amber-400 rounded-full mr-1.5"></span>
            Categories
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => toggleFilter('categories', category)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${
                  filters.categories.includes(category)
                    ? category === 'Family'
                      ? 'bg-blue-100 text-blue-800'
                      : category === 'Nature'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tags filter */}
        <div className="mb-3">
          <h4 className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-1.5"></span>
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter('tags', tag)}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs transition-colors ${
                  filters.tags.includes(tag)
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Moods filter */}
        <div className="mb-3">
          <h4 className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-1.5"></span>
            Moods
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allMoods.map(mood => (
              <button
                key={mood}
                onClick={() => toggleFilter('moods', mood)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium transition-colors ${
                  filters.moods.includes(mood)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites filter */}
        <div>
          <button
            onClick={() => toggleFilter('favorites', '')}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
              filters.favorites
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${filters.favorites ? 'fill-current' : ''}`} />
            <span>Favorites only</span>
          </button>
        </div>
      </div>
    </div>
  );
};
