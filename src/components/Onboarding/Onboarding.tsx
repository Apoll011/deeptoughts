import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Welcome } from './Welcome.tsx';
import { FeatureShowcase } from './FeatureShowcase.tsx';
import { AppTour } from './AppTour.tsx';
import { UserRegistration } from './UserRegistration.tsx';
import type { User } from '../../models/user.ts';
import type { IUserStorage } from '../../storage/userStorage.interface.ts';

const pages = ['welcome', 'features', 'tour', 'registration'];

export const Onboarding: React.FC<{ storage: IUserStorage, onComplete: () => void }> = ({ storage, onComplete }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(1);

    const handleNext = () => {
        setDirection(1);
        setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
    };

    const handleBack = () => {
        setDirection(-1);
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const handleRegistrationComplete = (user: User) => {
        storage.saveUser(user);
        storage.setOnboardingCompleted(true);
        onComplete();
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const renderPage = () => {
        switch (pages[currentPage]) {
            case 'welcome':
                return <Welcome onNext={handleNext} />;
            case 'features':
                return <FeatureShowcase onNext={handleNext} onBack={handleBack} />;
            case 'tour':
                return <AppTour onNext={handleNext} onBack={handleBack} />;
            case 'registration':
                return <UserRegistration onComplete={handleRegistrationComplete} onBack={handleBack} />;
            default:
                return null;
        }
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute h-full w-full"
                >
                    {renderPage()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};