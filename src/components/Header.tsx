import React, {useState} from "react";
import {FilterPanel, type FilterType} from "./FilterPanel.tsx";
import {Calendar, Grid3X3, List, Search} from "lucide-react";
import type {Thought, ViewMode} from "../models/types.ts";


export const Header: React.FC<{headerVisibility: number, viewMode: ViewMode, setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>, filters: FilterType, setFilters: React.Dispatch<React.SetStateAction<FilterType>>, thoughts: Thought[], searchQuery:string, setSearchQuery: React.Dispatch<React.SetStateAction<string>>}> = ({headerVisibility, thoughts, filters, setFilters, viewMode, setViewMode, searchQuery, setSearchQuery}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
            <div className="bg-white shadow-xl rounded-b-3xl backdrop-blur-sm "
                 style={{
                     paddingBottom: `${6 - (headerVisibility * 2) }px`,
                     transition: 'none'
                 }}>
                <div className="p-6"
                     style={{
                         paddingBottom: `${2 + (headerVisibility * 2)}px`,
                         transition: 'none'
                     }}>
                    <div className="flex items-center justify-between">
                        <div className="transform hover:scale-105"
                             style={{
                                 transform: `scale(${1 + ((1 - headerVisibility) * 0.05)})`,
                                 transition: 'none'
                             }}>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                                DeepThoughts
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 italic">Your mindful journal</p>
                        </div>
                    </div>

                    <div className="overflow-hidden transform"
                         style={{
                             maxHeight: `${headerVisibility * 384}px`,
                             opacity: headerVisibility,
                             marginTop: `${headerVisibility * 18}px`,
                             transform: `translateY(${(1 - headerVisibility) * -40}px)`,
                             transition: 'none'
                         }}>
                        <div className="relative mb-2 transform transition-all duration-300 hover:scale-[1.02]">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                            <input
                                type="text"
                                placeholder="Search your thoughts..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-inner border border-gray-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                        viewMode === 'month'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                    }`}
                                >
                                    <Calendar className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                        viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                    }`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                                    }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>

                            {/*
                            <div className="flex items-center">
                                <FilterPanel
                                    thoughts={thoughts}
                                    filters={filters}
                                    setFilters={setFilters}
                                    showFilters={showFilters}
                                    setShowFilters={setShowFilters}
                                />
                            </div>
                            */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}