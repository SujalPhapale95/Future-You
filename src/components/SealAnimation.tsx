'use client';

import { useEffect } from 'react';

interface SealAnimationProps {
    onComplete: () => void;
}

export default function SealAnimation({ onComplete }: SealAnimationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1200);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center z-[999]"
            style={{
                background: 'rgba(14, 12, 10, 0.92)',
                animation: 'fadeIn 0.3s ease'
            }}
        >
            <div
                className="text-6xl mb-6"
                style={{
                    animation: 'spin 0.8s linear infinite'
                }}
            >
                🔴
            </div>
            <h2
                className="text-3xl italic mb-3"
                style={{
                    fontFamily: "'Lora', serif",
                    color: '#f0ead8'
                }}
            >
                Contract Sealed.
            </h2>
            <p
                className="text-sm"
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#9a8f7e'
                }}
            >
                Your future self will hold you to this.
            </p>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
