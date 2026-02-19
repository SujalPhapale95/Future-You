'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ConditionBuilder, { ConditionInput } from '@/components/ConditionBuilder';
import ContractPreview from '@/components/ContractPreview';
import SealAnimation from '@/components/SealAnimation';
import ContractTemplates, { Template } from '@/components/ContractTemplates';
import SignatureCanvas from '@/components/SignatureCanvas';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { value: 'study', label: 'Study', color: '#d4924a' },
    { value: 'health', label: 'Health', color: '#5a9e6f' },
    { value: 'focus', label: 'Focus', color: '#e05c4a' },
    { value: 'relationships', label: 'Relationships', color: '#7a8fd4' },
    { value: 'finance', label: 'Finance', color: '#c4a84a' },
    { value: 'other', label: 'Other', color: '#4a4438' }
];

export default function NewContractPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSealAnimation, setShowSealAnimation] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('focus');
    const [conditions, setConditions] = useState<ConditionInput[]>([]);

    // Signature State
    const [signature, setSignature] = useState<string>('');
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setUserEmail(session.user.email);
            }
        };
        getUser();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.push('/auth/login');
            return;
        }

        try {
            // 1. Insert contract
            const { data: contractData, error: contractError } = await supabase
                .from('contracts')
                .insert({
                    user_id: session.user.id,
                    title,
                    body,
                    category,
                    status: 'active',
                    signature: signature,
                })
                .select()
                .single();

            if (contractError) throw contractError;

            // 2. Insert conditions
            if (conditions.length > 0) {
                const conditionsToInsert = conditions.map((c) => ({
                    contract_id: contractData.id,
                    type: c.type,
                    value: c.value,
                    is_recurring: c.is_recurring,
                }));

                const { error: conditionsError } = await supabase
                    .from('conditions')
                    .insert(conditionsToInsert);

                if (conditionsError) throw conditionsError;
            }

            // Show seal animation
            setShowSealAnimation(true);
        } catch (err) {
            console.error('Contract Creation Error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                setError((err as { message: string }).message);
            } else {
                setError(`An unexpected error occurred: ${JSON.stringify(err)}`);
            }
            setLoading(false);
        }
    };

    const handleSealComplete = () => {
        router.push('/dashboard');
        router.refresh();
    };

    return (
        <div className="min-h-screen" style={{ background: '#0e0c0a' }}>
            <Navbar />

            <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <div className="mb-10">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 mb-4 transition-colors"
                        style={{ color: '#5a5248' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#9a8f7e'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5a5248'}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="italic" style={{ fontFamily: "'Lora', serif", color: '#e05c4a' }}>New </span>
                        <span style={{ fontFamily: "'Lora', serif", color: '#f0ead8' }}>Contract</span>
                    </h1>
                    <p
                        className="text-xs uppercase tracking-widest"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.15em',
                            color: '#5a5248'
                        }}
                    >
                        A promise to your future self
                    </p>
                </div>

                <ContractTemplates onSelect={(template: Template) => {
                    setTitle(template.title);
                    setBody(template.body);
                    setCategory(template.category);
                    setConditions(template.conditions.map(c => ({
                        id: crypto.randomUUID(),
                        type: c.type as any,
                        value: c.value,
                        is_recurring: template.is_recurring
                    })));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                }} />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-xs uppercase tracking-widest mb-2"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.2em',
                                color: '#5a5248'
                            }}
                        >
                            Contract Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200"
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                background: '#1a1714',
                                border: '1px solid #2e2a24',
                                color: '#f0ead8'
                            }}
                            placeholder="Name your contract"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#e05c4a';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#2e2a24';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Promise */}
                    <div>
                        <label
                            htmlFor="body"
                            className="block text-xs uppercase tracking-widest mb-2"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.2em',
                                color: '#5a5248'
                            }}
                        >
                            Your Promise
                        </label>
                        <textarea
                            id="body"
                            required
                            rows={5}
                            className="w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200 resize-y"
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                background: '#1a1714',
                                border: '1px solid #2e2a24',
                                color: '#f0ead8',
                                minHeight: '120px'
                            }}
                            placeholder="Write your promise to your future self..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#e05c4a';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#2e2a24';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Category Pills */}
                    <div>
                        <label
                            className="block text-xs uppercase tracking-widest mb-3"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.2em',
                                color: '#5a5248'
                            }}
                        >
                            Category
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200"
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        letterSpacing: '0.08em',
                                        background: category === cat.value ? `${cat.color}26` : '#1a1714',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: category === cat.value ? cat.color : '#2e2a24',
                                        color: category === cat.value ? cat.color : '#5a5248'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className="border-t pt-8" style={{ borderColor: '#2e2a24' }}>
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: '#f0ead8'
                            }}
                        >
                            When should this remind you?
                        </h3>
                        <p
                            className="text-sm mb-6"
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                color: '#5a5248'
                            }}
                        >
                            Your contract fires when these conditions are met.
                        </p>
                        <ConditionBuilder conditions={conditions} onChange={setConditions} />
                    </div>

                    {error && (
                        <p className="text-sm" style={{ color: '#e05c4a' }}>
                            {error}
                        </p>
                    )}
                </form>

                {/* Live Contract Preview */}
                <div className="mt-10">
                    <ContractPreview
                        title={title}
                        body={body}
                        category={category}
                        conditions={conditions}
                        userEmail={userEmail}
                    />
                </div>

                {/* Signature input section */}
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{
                        fontFamily: "'Lora', serif",
                        fontSize: '18px',
                        color: '#f0ead8',
                        marginBottom: '12px'
                    }}>
                        Your Signature
                    </h3>
                    <p style={{ fontSize: '13px', color: '#5a5248', marginBottom: '16px' }}>
                        Sign this contract to make it official
                    </p>

                    {!signature ? (
                        <button
                            type="button"
                            onClick={() => setShowSignaturePad(true)}
                            style={{
                                padding: '12px 24px',
                                background: 'transparent',
                                color: '#9a8f7e',
                                border: '1px dashed #4a4438',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '14px',
                                width: '100%'
                            }}
                        >
                            ✍️ Click to sign
                        </button>
                    ) : (
                        <div style={{
                            background: '#faf6ee',
                            border: '1px solid #d4cfc2',
                            borderRadius: '8px',
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {signature.startsWith('data:image') ? (
                                <img src={signature} alt="signature" style={{ height: '40px' }} />
                            ) : (
                                <span style={{
                                    fontFamily: "'Brush Script MT', cursive",
                                    fontSize: '24px',
                                    color: '#2c2420'
                                }}>
                                    {signature}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setSignature('')}
                                style={{
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    color: '#6b6458',
                                    border: '1px solid #d4cfc2',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Change
                            </button>
                        </div>
                    )}

                    {showSignaturePad && !signature && (
                        <SignatureCanvas
                            onSave={(sig) => {
                                setSignature(sig);
                                setShowSignaturePad(false);
                            }}
                        />
                    )}
                </div>

                {/* Sign Contract Button */}
                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !signature}
                        className="w-full rounded-lg border-none px-4 py-4 text-lg italic font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            fontFamily: "'Lora', serif",
                            background: '#e05c4a',
                            boxShadow: '0 6px 28px rgba(224, 92, 74, 0.4)',
                            letterSpacing: '0.02em'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && signature) {
                                e.currentTarget.style.background = '#c94d3c';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 36px rgba(224, 92, 74, 0.55)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#e05c4a';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 28px rgba(224, 92, 74, 0.4)';
                        }}
                    >
                        {loading ? '🔴 Sealing...' : 'Sign & Seal this Contract →'}
                    </button>
                </div>
            </main>

            {/* Seal Animation Overlay */}
            {showSealAnimation && <SealAnimation onComplete={handleSealComplete} />}
        </div>
    );
}
