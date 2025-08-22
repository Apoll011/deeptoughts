import React, { useState } from 'react';
import type {CurrentView, Thought} from './models/types.ts';
import {ThoughtVisualizer} from "./components/Thought/Visualizer/ThoughtVisualizer.tsx";
import {Home} from "./components/Home.tsx";
import ThoughtEditor from "./components/Thought/Editor/ThoughtEditor.tsx";
import {InMemoryStorage} from "./storage/inMemoryStorage.ts";
import {ThoughtManager} from "./core/ThoughtManager.ts";
import {v4 as uuidv4} from "uuid";
import 'sweetalert2/dist/sweetalert2.min.css';
import {LocalStorage} from "./storage/LocalStorage.ts";
import {Onboarding} from "./components/Onboarding/Onboarding.tsx";

const thoughtStorage = new InMemoryStorage();
const userStorage = new LocalStorage();
const manager = new ThoughtManager(thoughtStorage);

const App: React.FC = () => {
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(userStorage.isOnboardingCompleted());
    const [currentView, setCurrentView] = useState<CurrentView>('timeline');
    const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
    const [newThought, setNewThought] = useState<Thought | null>(null);

    const startNewThought = () => {
        const thought: Thought = {
            id: uuidv4(),
            title: '',
            blocks: [],
            primaryEmotion: '',
            tags: [],
            category: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isFavorite: false,
            mood: 'calm',
            weather: '',
            location: ''
        };
        manager.createThought(thought);
        setNewThought(thought);
        setCurrentView('new');
    }

    if (!isOnboardingCompleted) {
        return <Onboarding storage={userStorage} onComplete={() => setIsOnboardingCompleted(true)} />;
    }

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {currentView === 'timeline' && (
                <Home startNewThought={startNewThought} manager={manager} setCurrentView={setCurrentView} setSelectedThought={setSelectedThought} />
            )}

            {currentView === 'editor' && selectedThought && (
                <ThoughtVisualizer
                    thoughtId={selectedThought.id}
                    manager={manager}
                    onBack={() => {setCurrentView('timeline')}}
                    showEdit={true}
                />
            )}

            {currentView === 'new' && newThought && (
                <ThoughtEditor
                    thoughtId={newThought.id}
                    manager={manager}
                    backAction={() => {setCurrentView("timeline")}}
                />
            )}
        </div>
    );
};

export default App;