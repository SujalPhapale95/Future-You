'use client';

import { ConditionType } from '@/types';
import { Plus, Trash2, Repeat } from 'lucide-react';
import TimePicker from './TimePicker';
import DaySelector from './DaySelector';

export interface ConditionInput {
    id: string;
    type: ConditionType;
    value: string;
    is_recurring: boolean;
}

interface ConditionBuilderProps {
    conditions: ConditionInput[];
    onChange: (conditions: ConditionInput[]) => void;
}

const SITUATION_SUGGESTIONS = [
    'Exam Week', 'Before Gym', 'Work from Home', 'Weekend', 'Weekday Morning', 'Traveling'
];

const LOCATION_SUGGESTIONS = [
    'Home', 'Office', 'Gym', 'Library', 'College', 'Coffee Shop'
];

export default function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
    const addCondition = () => {
        onChange([
            ...conditions,
            { id: crypto.randomUUID(), type: 'time', value: '', is_recurring: false },
        ]);
    };

    const removeCondition = (id: string) => {
        onChange(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, updates: Partial<ConditionInput>) => {
        onChange(
            conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    return (
        <div className="space-y-4">
            {conditions.length === 0 && (
                <p
                    className="text-sm italic mb-4"
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: '#5a5248'
                    }}
                >
                    No conditions set. Add one to define when this promise matters.
                </p>
            )}

            <div className="space-y-3">
                {conditions.map((condition) => (
                    <div
                        key={condition.id}
                        className="flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-start"
                        style={{
                            background: '#1a1714',
                            border: '1px solid #2e2a24'
                        }}
                    >
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <select
                                    value={condition.type}
                                    onChange={(e) => updateCondition(condition.id, { type: e.target.value as ConditionType, value: '' })}
                                    className="block w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 sm:w-1/3"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        background: '#232019',
                                        border: '1px solid #2e2a24',
                                        color: '#f0ead8'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#e05c4a';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#2e2a24';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="time">Time</option>
                                    <option value="day">Day of Week</option>
                                    <option value="location_tag">Location</option>
                                    <option value="situation_tag">Situation</option>
                                </select>

                                <div className="flex-1">
                                    {condition.type === 'time' ? (
                                        <TimePicker
                                            value={condition.value}
                                            onChange={(val) => updateCondition(condition.id, { value: val })}
                                        />
                                    ) : condition.type === 'day' ? (
                                        <DaySelector
                                            value={condition.value}
                                            onChange={(val) => updateCondition(condition.id, { value: val })}
                                        />
                                    ) : (
                                        <>
                                            <input
                                                list={`suggestions-${condition.id}`}
                                                type="text"
                                                value={condition.value}
                                                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                                placeholder={
                                                    condition.type === 'location_tag' ? 'e.g. Home, Gym' : 'e.g. Exam Week'
                                                }
                                                className="block w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#2e2a24';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            />
                                            <datalist id={`suggestions-${condition.id}`}>
                                                {(condition.type === 'location_tag' ? LOCATION_SUGGESTIONS : SITUATION_SUGGESTIONS).map(s => (
                                                    <option key={s} value={s} />
                                                ))}
                                            </datalist>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Recurring Toggle */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => updateCondition(condition.id, { is_recurring: !condition.is_recurring })}
                                    className={`
                                        flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors
                                        ${condition.is_recurring ? 'bg-amber-500/10 text-amber-500' : 'text-[var(--text-faint)] hover:text-[var(--text-secondary)]'}
                                    `}
                                >
                                    <Repeat className="h-3 w-3" />
                                    {condition.is_recurring ? 'Recurring' : 'One-time'}
                                </button>
                                <span className="text-[10px] text-[var(--text-faint)]">
                                    {condition.is_recurring
                                        ? '(Fires every time conditions are met)'
                                        : '(Fires once then deactivates)'
                                    }
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeCondition(condition.id)}
                            className="p-2 transition-colors self-start sm:self-center"
                            style={{ color: '#5a5248' }}
                            title="Remove"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#e05c4a'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#5a5248'}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addCondition}
                className="w-full rounded-lg border border-dashed px-5 py-3 text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.1em',
                    background: 'transparent',
                    borderColor: '#4a4438',
                    color: '#9a8f7e'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#e05c4a';
                    e.currentTarget.style.color = '#e05c4a';
                    e.currentTarget.style.background = 'rgba(224, 92, 74, 0.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#4a4438';
                    e.currentTarget.style.color = '#9a8f7e';
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                <Plus className="inline-block mr-2 h-4 w-4" />
                Add Condition
            </button>
        </div>
    );
}
