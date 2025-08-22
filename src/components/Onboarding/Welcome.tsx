import React from 'react';
import { motion } from 'framer-motion';
import {ArrowRight} from "lucide-react";

export const Welcome: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to DeepThoughts</h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Your personal space to capture, reflect, and grow. Let's begin a journey of mindfulness and self-discovery together.
                </p>
            </motion.div>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={onNext}
                className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center gap-2"
            >
                Get Started
                <ArrowRight className="w-5 h-5" />
            </motion.button>
        </div>
    );
};
