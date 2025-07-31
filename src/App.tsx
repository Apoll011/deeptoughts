import React, { useState } from 'react';
import type {CurrentView, Thought} from './types';
import {ThoughtVisualizer} from "./components/Thought/Visualizer/ThoughtVisualizer.tsx";
import {TimelineVisualizer} from "./components/TimelineVisualizer.tsx";
import ThoughtEditor from "./components/Thought/Editor/ThoughtEditor.tsx";

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<CurrentView>('timeline');
    const [selectedThought, setSelectedThought] = useState<Thought | null>(null);

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {currentView === 'timeline' && (
                <TimelineVisualizer setCurrentView={setCurrentView} setSelectedThought={setSelectedThought} />
            )}

            {currentView === 'editor' && selectedThought && (
                <ThoughtVisualizer selectedThought={selectedThought} onBack={() => {setCurrentView('timeline')}}/>
            )}

            {currentView === 'mindstream' && (
                <ThoughtEditor backAction={() => {setCurrentView("timeline")}}/>
            )}
        </div>
    );
};

export default App;
