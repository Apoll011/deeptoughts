import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { User } from '../../models/user.ts';
import { ArrowLeft, Check } from 'lucide-react';

export const UserRegistration: React.FC<{ onComplete: (user: User) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say'>('prefer-not-to-say');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        if (!birthdate) {
            setError('Please select your birthdate.');
            return;
        }
        setError('');
        onComplete({
            name,
            birthdate: new Date(birthdate),
            gender,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-800 mb-8 text-center"
            >
                Tell Us a Little About Yourself
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md space-y-6"
            >
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="What should we call you?"
                    />
                </div>
                <div>
                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                        Birthdate
                    </label>
                    <input
                        type="date"
                        id="birthdate"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                    </label>
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    >
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </motion.div>

            <div className="flex justify-between fixed bottom-5 left-0 right-0 px-8">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={onBack}
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform flex items-center gap-2"
                >
                    Complete
                    <Check className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};