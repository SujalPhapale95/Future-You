'use client';

import { Clock } from 'lucide-react';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                <Clock className="h-4 w-4" />
            </div>
            <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg bg-[var(--bg-elevated)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none transition-all focus:ring-2 focus:ring-[var(--accent-red)]/20"
                style={{
                    border: '1px solid var(--border)',
                    colorScheme: 'dark' // Forces dark calendar dropdown in typical browsers
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-red)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
        </div>
    );
}
