'use client';

import { ConditionType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

export interface ConditionInput {
    id: string;
    type: ConditionType;
    value: string;
}

interface ConditionBuilderProps {
    conditions: ConditionInput[];
    onChange: (conditions: ConditionInput[]) => void;
}

export default function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
    const addCondition = () => {
        onChange([
            ...conditions,
            { id: crypto.randomUUID(), type: 'time', value: '' },
        ]);
    };

    const removeCondition = (id: string) => {
        onChange(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, field: keyof ConditionInput, value: string) => {
        onChange(
            conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
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
                        className="flex items-start gap-3 rounded-lg p-4"
                        style={{
                            background: '#1a1714',
                            border: '1px solid #2e2a24'
                        }}
                    >
                        <div className="flex-1 space-y-3 sm:flex sm:gap-3 sm:space-y-0">
                            <select
                                value={condition.type}
                                onChange={(e) => updateCondition(condition.id, 'type', e.target.value)}
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
                                    <input
                                        type="time"
                                        value={condition.value}
                                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                                        className="block w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: '#232019',
                                            border: '1px solid #2e2a24',
                                            color: '#f0ead8'
                                        }}
                                        required
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#e05c4a';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#2e2a24';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                ) : condition.type === 'day' ? (
                                    <select
                                        value={condition.value}
                                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
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
                                    >
                                        <option value="">Select a day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={condition.value}
                                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
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
                                        required
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#e05c4a';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#2e2a24';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeCondition(condition.id)}
                            className="p-2 transition-colors"
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
