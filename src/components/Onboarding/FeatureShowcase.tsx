import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Edit3, Image, MapPin, Smile } from 'lucide-react';

const features = [
    {
        icon: <Edit3 className="w-10 h-10 text-yellow-500" />,
        title: 'Block-Based Editor',
        description: 'Craft your thoughts with text, media, location, and mood blocks.',
    },
    {
        icon: <Image className="w-10 h-10 text-orange-500" />,
        title: 'Rich Media',
        description: 'Add images, videos, and audio to bring your memories to life.',
    },
    {
        icon: <MapPin className="w-10 h-10 text-red-500" />,
        title: 'Location Tagging',
        description: 'Remember where you were by tagging your thoughts with a location.',
    },
    {
        icon: <Smile className="w-10 h-10 text-pink-500" />,
        title: 'Mood Tracking',
        description: 'Log your emotions to understand your feelings over time.',
    },
];

export const FeatureShowcase: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-800 mb-12 text-center"
            >
                Powerful Features
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full pb-0">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="flex items-start space-x-4 p-2 rounded-lg"
                    >
                        <div className="flex-shrink-0 bg-gray-100 p-4 rounded-full">{feature.icon}</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-between fixed bottom-5 left-0 right-0 px-8">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={onBack}
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
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