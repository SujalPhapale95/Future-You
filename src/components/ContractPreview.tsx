'use client';

import { ConditionInput } from './ConditionBuilder';

interface ContractPreviewProps {
    title: string;
    body: string;
    category: string;
    conditions: ConditionInput[];
    userEmail?: string;
    signature?: string;
}

const categoryColors: Record<string, string> = {
    study: '#d4924a',
    health: '#5a9e6f',
    focus: '#e05c4a',
    relationships: '#7a8fd4',
    finance: '#c4a84a',
    other: '#4a4438'
};

export default function ContractPreview({ title, body, category, conditions, userEmail, signature }: ContractPreviewProps) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div
            className="contract-preview relative rounded px-16 py-14 transition-opacity duration-200"
            style={{
                background: '#faf6ee',
                border: '1px solid #d4cfc2',
                boxShadow: `
                    0 4px 6px rgba(0,0,0,0.05),
                    0 10px 40px rgba(0,0,0,0.12),
                    inset 0 0 0 1px rgba(255,255,255,0.8)
                `,
                fontFamily: "'Lora', serif",
                color: '#2c2420'
            }}
        >
            {/* Paper texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none rounded"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
                    opacity: 1
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="border-t mb-3" style={{ borderColor: '#d4cfc2' }} />
                    <h2
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.25em',
                            color: '#6b6458'
                        }}
                    >
                        Contract of Commitment
                    </h2>
                    <div className="border-t mb-6" style={{ borderColor: '#d4cfc2' }} />

                    <h1
                        className="text-3xl italic font-semibold"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: title ? '#2c2420' : '#b8b0a4'
                        }}
                    >
                        {title || 'Your contract title will appear here...'}
                    </h1>
                </div>

                {/* Body */}
                <div className="space-y-6 text-base leading-relaxed" style={{ lineHeight: '1.9' }}>
                    <p style={{ color: '#4a3f38' }}>
                        I, <span className="font-medium">{userEmail || '[your email]'}</span>, being of sound mind and full awareness of my own patterns and tendencies, do hereby make the following solemn promise to my future self:
                    </p>

                    {/* Promise Block Quote */}
                    <div
                        className="my-6 px-6 py-4 italic text-lg"
                        style={{
                            background: 'rgba(224, 92, 74, 0.04)',
                            borderLeft: '3px solid #e05c4a',
                            fontFamily: "'Lora', serif",
                            color: body ? '#2c2420' : '#b8b0a4'
                        }}
                    >
                        {body || 'Your promise will appear here...'}
                    </div>

                    {/* Conditions */}
                    <div>
                        <p className="mb-3" style={{ color: '#4a3f38' }}>
                            This promise shall be active under the following conditions:
                        </p>
                        <ul className="space-y-2 ml-6">
                            {conditions.length > 0 ? (
                                conditions.map((condition, index) => (
                                    <li key={index} style={{ color: '#4a3f38' }}>
                                        · {condition.type === 'time' && `At ${condition.value}`}
                                        {condition.type === 'day' && `On ${condition.value}`}
                                        {condition.type === 'location_tag' && `When at ${condition.value}`}
                                        {condition.type === 'situation_tag' && `During ${condition.value}`}
                                        {condition.is_recurring && <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Recurring</span>}
                                    </li>
                                ))
                            ) : (
                                <li style={{ color: '#b8b0a4' }}>· No conditions set yet</li>
                            )}
                        </ul>
                    </div>

                    {/* Category */}
                    <div>
                        <span style={{ color: '#4a3f38' }}>Category: </span>
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                background: `${categoryColors[category]}26`,
                                color: categoryColors[category],
                                letterSpacing: '0.08em'
                            }}
                        >
                            {category}
                        </span>
                    </div>

                    {/* Date */}
                    <p
                        className="mt-8 text-sm"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: '#9a8f7e'
                        }}
                    >
                        Signed on this day, {currentDate}
                    </p>

                    {/* Signature Line */}
                    <div className="mt-8 pt-8">
                        {signature ? (
                            <div className="mb-2">
                                {signature.startsWith('data:image') ? (
                                    <img src={signature} alt="signature" style={{ height: '40px' }} />
                                ) : (
                                    <div style={{
                                        fontFamily: "'Brush Script MT', cursive",
                                        fontSize: '24px',
                                        color: '#2c2420',
                                        padding: '4px 0'
                                    }}>
                                        {signature}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="w-48 mb-2"
                                style={{
                                    borderBottom: '1px solid #6b6458'
                                }}
                            />
                        )}
                        <p
                            className="text-xs"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#9a8f7e'
                            }}
                        >
                            Your Signature (Future-You)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
