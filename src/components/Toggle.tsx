'use client';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
}

export default function Toggle({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p
                    className="font-medium mb-1"
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: '#f0ead8',
                        fontSize: '14px'
                    }}
                >
                    {label}
                </p>
                {description && (
                    <p
                        className="text-xs"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: '#5a5248'
                        }}
                    >
                        {description}
                    </p>
                )}
            </div>
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                    background: enabled ? '#e05c4a' : '#4a4438'
                }}
            >
                <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{
                        transform: enabled ? 'translateX(26px)' : 'translateX(4px)'
                    }}
                />
            </button>
        </div>
    );
}
