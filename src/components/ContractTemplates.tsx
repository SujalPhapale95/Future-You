'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

export type Template = {
    category: string;
    title: string;
    body: string;
    conditions: { type: string; value: string }[];
    is_recurring: boolean;
};

const TEMPLATES: Template[] = [
    {
        category: 'study',
        title: 'No social media until study session done',
        body: 'I will not open Instagram, TikTok, or any social media until I complete at least 1 hour of focused study.',
        conditions: [
            { type: 'situation_tag', value: 'exam week' },
            { type: 'time', value: '18:00' }
        ],
        is_recurring: true
    },
    {
        category: 'health',
        title: 'Drink water before checking phone',
        body: 'Every morning, I will drink a full glass of water before picking up my phone.',
        conditions: [
            { type: 'time', value: '08:00' }
        ],
        is_recurring: true
    },
    {
        category: 'relationships',
        title: 'Text a friend this weekend',
        body: 'I will reach out to at least one friend this weekend just to check in.',
        conditions: [
            { type: 'day', value: 'Sunday' },
            { type: 'time', value: '19:00' }
        ],
        is_recurring: true
    },
    {
        category: 'focus',
        title: 'No Netflix until task is complete',
        body: 'I will not open Netflix or any streaming service until I finish the task I planned for today.',
        conditions: [
            { type: 'time', value: '20:00' }
        ],
        is_recurring: true
    },
    {
        category: 'health',
        title: 'No snooze button for 7 days',
        body: 'For the next 7 days, I will get out of bed when my alarm goes off — no snooze.',
        conditions: [
            { type: 'time', value: '07:00' }
        ],
        is_recurring: true
    },
    {
        category: 'finance',
        title: 'No impulse purchases this week',
        body: 'Before buying anything non-essential, I will wait 24 hours to decide if I really need it.',
        conditions: [
            { type: 'day', value: 'Friday' },
            { type: 'time', value: '18:00' }
        ],
        is_recurring: true
    }
];

interface ContractTemplatesProps {
    onSelect: (template: Template) => void;
}

export default function ContractTemplates({ onSelect }: ContractTemplatesProps) {
    return (
        <div className="mb-12 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--accent-red)]" />
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                    Start from a template
                </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(template)}
                        className="group relative flex flex-col items-start rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left transition-all hover:border-[var(--accent-red)] hover:shadow-lg"
                    >
                        {/* Category Tag Line */}
                        <div className="absolute left-0 top-4 h-8 w-1 rounded-r-full bg-[var(--accent-red)] opacity-50 transition-opacity group-hover:opacity-100" />

                        <span className="mb-2 rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                            {template.category}
                        </span>

                        <h4 className="mb-1 font-serif font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-red)]">
                            {template.title}
                        </h4>

                        <p className="mb-4 line-clamp-2 text-xs text-[var(--text-secondary)]">
                            {template.body}
                        </p>

                        <div className="mt-auto flex items-center gap-1 text-xs font-medium text-[var(--text-faint)] transition-colors group-hover:text-[var(--text-primary)]">
                            Use this template <ArrowRight className="h-3 w-3" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
