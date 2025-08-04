import React, { useState } from 'react';
import type {CurrentView, Thought} from './models/types.ts';
import {TimelineVisualizer} from "./components/TimelineVisualizer.tsx";
import {InMemoryStorage} from "./storage/inMemoryStorage.ts";
import {ThoughtManager} from "./core/ThoughtManager.ts";

const storage = new InMemoryStorage();
const manager = new ThoughtManager(storage);

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<CurrentView>('timeline');
    const [, setSelectedThought] = useState<Thought | null>(null);

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {currentView === 'timeline' && (
                <TimelineVisualizer manager={manager} setCurrentView={setCurrentView} setSelectedThought={setSelectedThought} />
            )}

            {/*currentView === 'editor' && selectedThought && (
                <ThoughtVisualizer
                    selectedThought={selectedThought}
                    onBack={() => {setCurrentView('timeline')}}
                />
            )*/}

            {/*currentView === 'mindstream' && (
                <ThoughtEditor
                    backAction={() => {setCurrentView("timeline")}}
                />
            )*/}
        </div>
    );
};

export default App;
