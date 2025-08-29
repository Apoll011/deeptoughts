import React, {useMemo, useState} from 'react';
import type {CurrentView, Thought} from './models/types.ts';
import {ThoughtVisualizer} from "./components/Thought/Visualizer/ThoughtVisualizer.tsx";
import {Home} from "./components/Home.tsx";
import ThoughtEditor from "./components/Thought/Editor/ThoughtEditor.tsx";
import {v4 as uuidv4} from "uuid";
import 'sweetalert2/dist/sweetalert2.min.css';
import {Onboarding} from "./components/Onboarding/Onboarding.tsx";
import { AppProvider, useAppContext } from './context/AppContext.tsx';

const AppContent: React.FC = () => {
    const { userStorage, manager } = useAppContext();
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(userStorage.isOnboardingCompleted());
    const [currentView, setCurrentView] = useState<CurrentView>('timeline');
    const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
    const [newThought, setNewThought] = useState<Thought | null>(null);

    const [thoughts, setThoughts] = useState<Thought[]>([]);
    useMemo(() => {
        setThoughts(manager.getAllThoughts());
    }, [manager]);

    React.useEffect(() => {
        const refresh = () => setThoughts(manager.getAllThoughts());
        window.addEventListener('thoughts:changed', refresh);
        return () => window.removeEventListener('thoughts:changed', refresh);
    }, [manager]);

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
            mood: '',
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
                <Home startNewThought={startNewThought} setCurrentView={setCurrentView} setSelectedThought={setSelectedThought} thoughts={thoughts} />
            )}

            {currentView === 'editor' && selectedThought && (
                <ThoughtVisualizer
                    thoughtId={selectedThought.id}
                    onBack={() => {setCurrentView('timeline')}}
                    showEdit={true}
                />
            )}

            {currentView === 'new' && newThought && (
                <ThoughtEditor
                    thoughtId={newThought.id}
                    backAction={() => {setCurrentView("timeline")}}
                />
            )}
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;