'use client';

interface DaySelectorProps {
    value: string; // Comma separated string: "Monday,Wednesday"
    onChange: (value: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DaySelector({ value, onChange }: DaySelectorProps) {
    const selectedDays = value.split(',').filter(Boolean);

    const toggleDay = (fullDay: string) => {
        const newSelection = selectedDays.includes(fullDay)
            ? selectedDays.filter(d => d !== fullDay)
            : [...selectedDays, fullDay];

        // Sort based on week order
        newSelection.sort((a, b) => FULL_DAYS.indexOf(a) - FULL_DAYS.indexOf(b));

        onChange(newSelection.join(','));
    };

    return (
        <div className="flex flex-wrap gap-2">
            {FULL_DAYS.map((day, idx) => {
                const isSelected = selectedDays.includes(day);
                return (
                    <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`
                            rounded-full px-3 py-1.5 text-xs font-medium transition-all
                            ${isSelected
                                ? 'bg-[var(--accent-red)] text-white shadow-lg shadow-red-900/20'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                            }
                        `}
                        style={{
                            border: isSelected ? 'none' : '1px solid var(--border)'
                        }}
                    >
                        {DAYS[idx]}
                    </button>
                );
            })}
        </div>
    );
}
