import React, {useMemo, useState} from "react";

export const TextBlock: React.FC<{ content: string; timestamp?: Date }> = ({ content, timestamp }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = content.length > 300;

    const displayContent = useMemo(() => {
        if (!isLongText || isExpanded) return content;
        return content.substring(0, 300) + '...';
    }, [content, isLongText, isExpanded]);

    function formatTime(date: Date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const formatText = (text: string) => {
        return text
            .split(/(\s+)/)
            .map((word, index) => {
                if (word.match(/^https?:\/\/[^\s]+$/)) {
                    return (
                        <a
                            key={index}
                            href={word}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {word}
                        </a>
                    );
                }
                if (word.match(/^#[a-zA-Z0-9_]+$/)) {
                    return (
                        <span key={index} className="text-blue-500 font-medium">
                            {word}
                        </span>
                    );
                }
                if (word.match(/^@[a-zA-Z0-9_]+$/)) {
                    return (
                        <span key={index} className="text-purple-600 font-medium">
                            {word}
                        </span>
                    );
                }
                return word;
            });
    };

    return (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ">
            <div className="prose prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed text-base m-0 whitespace-pre-wrap">
                    {formatText(displayContent)}
                </p>
            </div>

            {isLongText && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                >
                    <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

            {timestamp && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <time className="text-xs text-gray-500">
                        {formatTime(timestamp)}
                    </time>
                </div>
            )}
        </div>
    );
};