import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Edit, BarChart2 } from 'lucide-react';

const tourPages = [
    {
        icon: <Home className="w-12 h-12 text-yellow-500" />,
        title: 'Home Page',
        description: 'See all your thoughts at a glance. Filter, search, and switch between grid, list, and calendar views.',
    },
    {
        icon: <Edit className="w-12 h-12 text-orange-500" />,
        title: 'Editor',
        description: 'A powerful, intuitive editor to compose your thoughts with different content blocks.',
    },
    {
        icon: <BarChart2 className="w-12 h-12 text-red-500" />,
        title: 'Visualizer',
        description: 'Review your thoughts in a clean, beautiful, and easy-to-read format.',
    },
];

export const AppTour: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [currentPage, setCurrentPage] = React.useState(0);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % tourPages.length);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + tourPages.length) % tourPages.length);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-800 mb-8 text-center"
            >
                Take a Quick Tour
            </motion.h1>

            <div className="relative w-full max-w-sm h-64">
                {tourPages.map((page, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: (index === currentPage ? 0 : (index > currentPage ? 100 : -100)) }}
                        animate={{ opacity: (index === currentPage ? 1 : 0), x: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="absolute w-full h-full flex flex-col items-center text-center"
                    >
                        <div className="mb-4">{page.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{page.title}</h3>
                        <p className="text-gray-600">{page.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center space-x-4">
                <button onClick={handlePrevPage} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex space-x-2">
                    {tourPages.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full ${currentPage === index ? 'bg-yellow-500' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
                <button onClick={handleNextPage} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <ArrowRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            <div className="flex justify-between fixed bottom-5 left-0 right-0 px-8">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={onBack}
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={onNext}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform flex items-center gap-2"
                >
                    Next
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};