'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-20 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center justify-between rounded-lg border p-4 shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in
                            ${toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-900 text-emerald-100' : ''}
                            ${toast.type === 'error' ? 'bg-red-950/80 border-red-900 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-blue-950/80 border-blue-900 text-blue-100' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-70 hover:opacity-100">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
