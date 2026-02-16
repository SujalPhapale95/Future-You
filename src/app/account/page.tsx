'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { User, Bell, BarChart3, Tag, Palette, Shield, ChevronRight, Save, Download, Trash2, AlertTriangle } from 'lucide-react';

type Section = 'profile' | 'notifications' | 'stats' | 'categories' | 'appearance' | 'privacy';

interface UserStats {
    totalContracts: number;
    keptRate: number;
    currentStreak: number;
    bestStreak: number;
}

export default function AccountPage() {
    const router = useRouter();
    const supabase = createClient();

    const [activeSection, setActiveSection] = useState<Section>('profile');
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [tagline, setTagline] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification state
    const [pushEnabled, setPushEnabled] = useState(false);
    const [contractReminders, setContractReminders] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(true);
    const [streakAlerts, setStreakAlerts] = useState(true);
    const [quietFrom, setQuietFrom] = useState('22:00');
    const [quietUntil, setQuietUntil] = useState('08:00');

    // Stats state
    const [stats, setStats] = useState<UserStats>({
        totalContracts: 0,
        keptRate: 0,
        currentStreak: 0,
        bestStreak: 0
    });

    // Categories state
    const [categories, setCategories] = useState<string[]>(['study', 'health', 'focus', 'relationships', 'finance', 'other']);
    const [newCategory, setNewCategory] = useState('');

    // Appearance state

    const [accentColor, setAccentColor] = useState('#e05c4a');
    const [compactMode, setCompactMode] = useState(false);

    const accentColors = ['#e05c4a', '#d4924a', '#5a9e6f', '#7a8fd4', '#c4a84a', '#a06ab4', '#5ab4c4'];

    useEffect(() => {
        loadUserData();
        loadPreferences();
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/auth/login');
            return;
        }

        setUser(user);
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || '');
        setTagline(user.user_metadata?.tagline || '');
        setLoading(false);
    };

    const loadPreferences = () => {
        const prefs = localStorage.getItem('notification_preferences');
        if (prefs) {
            const parsed = JSON.parse(prefs);
            setPushEnabled(parsed.pushEnabled ?? false);
            setContractReminders(parsed.contractReminders ?? true);
            setWeeklySummary(parsed.weeklySummary ?? true);
            setStreakAlerts(parsed.streakAlerts ?? true);
        }

        const quiet = localStorage.getItem('quiet_hours');
        if (quiet) {
            const parsed = JSON.parse(quiet);
            setQuietFrom(parsed.from || '22:00');
            setQuietUntil(parsed.until || '08:00');
        }



        const accent = localStorage.getItem('accent_color');
        if (accent) setAccentColor(accent);

        const compact = localStorage.getItem('compact_mode');
        if (compact) setCompactMode(compact === 'true');
    };

    const loadStats = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get total contracts
        const { count: totalContracts } = await supabase
            .from('contracts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Get contract IDs first
        const { data: contracts } = await supabase
            .from('contracts')
            .select('id')
            .eq('user_id', user.id);

        const contractIds = contracts?.map(c => c.id) || [];

        // Get kept rate
        const { data: reminders } = await supabase
            .from('reminders')
            .select('response')
            .in('contract_id', contractIds);

        const keptCount = reminders?.filter(r => r.response === 'kept').length || 0;
        const totalResponses = reminders?.filter(r => r.response).length || 0;
        const keptRate = totalResponses > 0 ? Math.round((keptCount / totalResponses) * 100) : 0;

        setStats({
            totalContracts: totalContracts || 0,
            keptRate,
            currentStreak: 5, // Placeholder
            bestStreak: 12 // Placeholder
        });
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await supabase.auth.updateUser({
                data: { full_name: fullName, tagline }
            });
            showToast('Profile updated ✓', 'success');
        } catch {
            showToast('Failed to update profile', 'error');
        }
        setSaving(false);
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setSaving(true);
        try {
            await supabase.auth.updateUser({ password: newPassword });
            showToast('Password updated ✓', 'success');

            setNewPassword('');
            setConfirmPassword('');
        } catch {
            showToast('Failed to update password', 'error');
        }
        setSaving(false);
    };

    const saveNotificationPreferences = () => {
        localStorage.setItem('notification_preferences', JSON.stringify({
            pushEnabled,
            contractReminders,
            weeklySummary,
            streakAlerts
        }));
        localStorage.setItem('quiet_hours', JSON.stringify({
            from: quietFrom,
            until: quietUntil
        }));
        showToast('Preferences saved ✓', 'success');
    };

    const handleExportCSV = async () => {
        if (!user) return;

        const { data: contracts } = await supabase
            .from('contracts')
            .select('*')
            .eq('user_id', user.id);

        if (!contracts) return;

        const csv = [
            ['Title', 'Category', 'Status', 'Created At'].join(','),
            ...contracts.map(c => [c.title, c.category, c.status, c.created_at].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contracts.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearAll = async () => {
        if (!user) return;
        if (!confirm('Are you sure? This cannot be undone.')) return;

        await supabase.from('contracts').delete().eq('user_id', user.id);
        showToast('All contracts cleared', 'success');
        router.push('/dashboard');
    };

    const handleDeleteAccount = async () => {
        const confirmation = prompt('Type DELETE to confirm account deletion:');
        if (confirmation !== 'DELETE') return;

        await supabase.auth.signOut();
        router.push('/');
    };

    const showToast = (message: string, _type: 'success' | 'error') => {
        // Simple toast implementation
        alert(message);
    };

    const getUserInitial = () => {
        if (fullName) return fullName[0].toUpperCase();
        if (email) return email[0].toUpperCase();
        return 'U';
    };

    const navItems = [
        { id: 'profile' as Section, icon: User, label: 'Profile' },
        { id: 'notifications' as Section, icon: Bell, label: 'Notifications' },
        { id: 'stats' as Section, icon: BarChart3, label: 'My Stats' },
        { id: 'categories' as Section, icon: Tag, label: 'Categories' },
        { id: 'appearance' as Section, icon: Palette, label: 'Appearance' },
        { id: 'privacy' as Section, icon: Shield, label: 'Data & Privacy' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen" style={{ background: '#0e0c0a' }}>
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <p style={{ color: '#9a8f7e' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#0e0c0a' }}>
            <Navbar />

            <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Avatar Card */}
                        <div
                            className="rounded-2xl p-6 text-center"
                            style={{
                                background: '#1a1714',
                                border: '1px solid #2e2a24'
                            }}
                        >
                            <div
                                className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full text-2xl font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #e05c4a, #d4924a)',
                                    boxShadow: '0 0 0 3px rgba(224,92,74,0.2), 0 0 24px rgba(224,92,74,0.15)',
                                    color: '#fff',
                                    fontFamily: "'Lora', serif"
                                }}
                            >
                                {getUserInitial()}
                            </div>
                            <h3
                                className="mb-1 text-lg font-semibold"
                                style={{
                                    fontFamily: "'Lora', serif",
                                    color: '#f0ead8'
                                }}
                            >
                                {fullName || 'User'}
                            </h3>
                            <p
                                className="mb-4 text-sm"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    color: '#5a5248'
                                }}
                            >
                                {email}
                            </p>
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                                style={{
                                    background: 'rgba(90,158,111,0.12)',
                                    border: '1px solid rgba(90,158,111,0.3)',
                                    color: '#5a9e6f',
                                    fontFamily: "'JetBrains Mono', monospace"
                                }}
                            >
                                ⚡ {stats.currentStreak}-day streak
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all"
                                        style={{
                                            background: isActive ? '#232019' : 'transparent',
                                            borderLeft: isActive ? '3px solid #e05c4a' : '3px solid transparent',
                                            color: isActive ? '#f0ead8' : '#9a8f7e',
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = '#232019';
                                                e.currentTarget.style.color = '#f0ead8';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#9a8f7e';
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div
                        className="space-y-6"
                        style={{ animation: 'fadeUp 0.4s ease forwards' }}
                    >
                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <div className="space-y-6">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    Profile
                                </h2>

                                {/* Personal Info Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Personal Info
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                className="mb-2 block text-xs uppercase tracking-wider"
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#2e2a24';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-xs uppercase tracking-wider"
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                readOnly
                                                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#5a5248',
                                                    cursor: 'not-allowed'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-xs uppercase tracking-wider"
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Tagline
                                            </label>
                                            <input
                                                type="text"
                                                value={tagline}
                                                onChange={(e) => setTagline(e.target.value)}
                                                placeholder="A promise keeper..."
                                                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#2e2a24';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="mt-4 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all"
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                background: '#e05c4a',
                                                color: '#fff',
                                                boxShadow: '0 4px 20px rgba(224,92,74,0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#c94d3c';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#e05c4a';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <Save className="h-4 w-4" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Password
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    className="mb-2 block text-xs uppercase tracking-wider"
                                                    style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        background: '#232019',
                                                        border: '1px solid #2e2a24',
                                                        color: '#f0ead8'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = '#e05c4a';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = '#2e2a24';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="mb-2 block text-xs uppercase tracking-wider"
                                                    style={{
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        background: '#232019',
                                                        border: '1px solid #2e2a24',
                                                        color: '#f0ead8'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = '#e05c4a';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = '#2e2a24';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleUpdatePassword}
                                            disabled={saving || !newPassword || !confirmPassword}
                                            className="mt-4 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all disabled:opacity-50"
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                background: '#e05c4a',
                                                color: '#fff',
                                                boxShadow: '0 4px 20px rgba(224,92,74,0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!saving && newPassword && confirmPassword) {
                                                    e.currentTarget.style.background = '#c94d3c';
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#e05c4a';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'notifications' && (
                            <div className="space-y-6">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    Notifications
                                </h2>

                                {/* Push Notifications Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Push Notifications
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="space-y-1 divide-y" style={{ borderColor: '#2e2a24' }}>
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
                                                    Enable Push Notifications
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Receive contract reminders
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPushEnabled(!pushEnabled);
                                                    saveNotificationPreferences();
                                                }}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                style={{
                                                    background: pushEnabled ? '#e05c4a' : '#4a4438'
                                                }}
                                            >
                                                <span
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                    style={{
                                                        transform: pushEnabled ? 'translateX(26px)' : 'translateX(4px)'
                                                    }}
                                                />
                                            </button>
                                        </div>

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
                                                    Contract Reminders
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Get notified when conditions are met
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setContractReminders(!contractReminders);
                                                    saveNotificationPreferences();
                                                }}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                style={{
                                                    background: contractReminders ? '#e05c4a' : '#4a4438'
                                                }}
                                            >
                                                <span
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                    style={{
                                                        transform: contractReminders ? 'translateX(26px)' : 'translateX(4px)'
                                                    }}
                                                />
                                            </button>
                                        </div>

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
                                                    Weekly Summary
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Sunday evening digest notification
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setWeeklySummary(!weeklySummary);
                                                    saveNotificationPreferences();
                                                }}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                style={{
                                                    background: weeklySummary ? '#e05c4a' : '#4a4438'
                                                }}
                                            >
                                                <span
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                    style={{
                                                        transform: weeklySummary ? 'translateX(26px)' : 'translateX(4px)'
                                                    }}
                                                />
                                            </button>
                                        </div>

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
                                                    Streak Alerts
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Notify when streak is at risk
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStreakAlerts(!streakAlerts);
                                                    saveNotificationPreferences();
                                                }}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                style={{
                                                    background: streakAlerts ? '#e05c4a' : '#4a4438'
                                                }}
                                            >
                                                <span
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                    style={{
                                                        transform: streakAlerts ? 'translateX(26px)' : 'translateX(4px)'
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quiet Hours Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Quiet Hours
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <p
                                        className="mb-4 text-sm"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            color: '#9a8f7e'
                                        }}
                                    >
                                        No notifications will be sent during these hours
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                className="mb-2 block text-xs uppercase tracking-wider"
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Quiet From
                                            </label>
                                            <input
                                                type="time"
                                                value={quietFrom}
                                                onChange={(e) => {
                                                    setQuietFrom(e.target.value);
                                                    saveNotificationPreferences();
                                                }}
                                                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#2e2a24';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-xs uppercase tracking-wider"
                                                style={{
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Quiet Until
                                            </label>
                                            <input
                                                type="time"
                                                value={quietUntil}
                                                onChange={(e) => {
                                                    setQuietUntil(e.target.value);
                                                    saveNotificationPreferences();
                                                }}
                                                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,92,74,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#2e2a24';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Section */}
                        {activeSection === 'stats' && (
                            <div>
                                <h2
                                    className="mb-6 text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    My Stats
                                </h2>

                                {/* Streak Display */}
                                <div
                                    className="mb-6 rounded-2xl p-8 text-center"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <div className="text-6xl mb-4">🔥</div>
                                    <div
                                        className="text-5xl font-bold mb-2"
                                        style={{
                                            fontFamily: "'Lora', serif",
                                            color: '#f0ead8'
                                        }}
                                    >
                                        {stats.currentStreak} Day Streak
                                    </div>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            color: '#5a5248'
                                        }}
                                    >
                                        Your best was {stats.bestStreak} days
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                                    <div
                                        className="rounded-xl p-6"
                                        style={{
                                            background: '#1a1714',
                                            border: '1px solid #2e2a24'
                                        }}
                                    >
                                        <p
                                            className="mb-2 text-xs uppercase tracking-wider"
                                            style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                color: '#5a5248'
                                            }}
                                        >
                                            Total Contracts
                                        </p>
                                        <p
                                            className="text-3xl font-bold"
                                            style={{
                                                fontFamily: "'Lora', serif",
                                                color: '#f0ead8'
                                            }}
                                        >
                                            {stats.totalContracts}
                                        </p>
                                    </div>

                                    <div
                                        className="rounded-xl p-6"
                                        style={{
                                            background: '#1a1714',
                                            border: '1px solid #2e2a24'
                                        }}
                                    >
                                        <p
                                            className="mb-2 text-xs uppercase tracking-wider"
                                            style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                color: '#5a5248'
                                            }}
                                        >
                                            Kept Rate
                                        </p>
                                        <p
                                            className="text-3xl font-bold"
                                            style={{
                                                fontFamily: "'Lora', serif",
                                                color: '#5a9e6f'
                                            }}
                                        >
                                            {stats.keptRate}%
                                        </p>
                                    </div>

                                    <div
                                        className="rounded-xl p-6"
                                        style={{
                                            background: '#1a1714',
                                            border: '1px solid #2e2a24'
                                        }}
                                    >
                                        <p
                                            className="mb-2 text-xs uppercase tracking-wider"
                                            style={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                color: '#5a5248'
                                            }}
                                        >
                                            Best Streak
                                        </p>
                                        <p
                                            className="text-3xl font-bold"
                                            style={{
                                                fontFamily: "'Lora', serif",
                                                color: '#d4924a'
                                            }}
                                        >
                                            {stats.bestStreak}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Categories Section */}
                        {activeSection === 'categories' && (
                            <div className="space-y-6">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    Categories
                                </h2>

                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Your Categories
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                                                style={{
                                                    background: 'rgba(224,92,74,0.12)',
                                                    border: '1px solid rgba(224,92,74,0.3)',
                                                    color: '#e05c4a',
                                                    fontFamily: "'DM Sans', sans-serif"
                                                }}
                                            >
                                                {category}
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Remove "${category}" category? Contracts will move to "other"`)) {
                                                            setCategories(categories.filter(c => c !== category));
                                                        }
                                                    }}
                                                    className="hover:opacity-70 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {newCategory ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="New category name..."
                                                className="flex-1 rounded-lg px-4 py-2 text-sm outline-none"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: '#232019',
                                                    border: '1px solid #2e2a24',
                                                    color: '#f0ead8'
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                                        setCategories([...categories, e.currentTarget.value.toLowerCase()]);
                                                        setNewCategory('');
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setNewCategory('');
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setNewCategory('')}
                                                className="px-3 py-2 rounded-lg text-sm"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: 'transparent',
                                                    border: '1px solid #4a4438',
                                                    color: '#9a8f7e'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setNewCategory('new')}
                                            className="w-full rounded-lg border border-dashed px-5 py-3 text-sm transition-all"
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                background: 'transparent',
                                                borderColor: '#4a4438',
                                                color: '#9a8f7e'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#e05c4a';
                                                e.currentTarget.style.color = '#e05c4a';
                                                e.currentTarget.style.background = 'rgba(224,92,74,0.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#4a4438';
                                                e.currentTarget.style.color = '#9a8f7e';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            + New Category
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === 'appearance' && (
                            <div className="space-y-6">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    Appearance
                                </h2>

                                {/* Accent Color Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Accent Color
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <p
                                        className="mb-4 text-sm"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            color: '#9a8f7e'
                                        }}
                                    >
                                        Choose your primary accent color
                                    </p>

                                    <div className="flex gap-3">
                                        {accentColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    setAccentColor(color);
                                                    localStorage.setItem('accent_color', color);
                                                }}
                                                className="relative h-10 w-10 rounded-full transition-transform hover:scale-110"
                                                style={{
                                                    background: color,
                                                    border: accentColor === color ? `3px solid ${color}` : '3px solid transparent',
                                                    boxShadow: accentColor === color ? `0 0 0 2px #1a1714, 0 0 12px ${color}` : 'none'
                                                }}
                                            >
                                                {accentColor === color && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Compact Mode Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Display Preferences
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p
                                                className="font-medium mb-1"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    color: '#f0ead8',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Compact Mode
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    color: '#5a5248'
                                                }}
                                            >
                                                Reduce padding for a denser layout
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCompactMode(!compactMode);
                                                localStorage.setItem('compact_mode', (!compactMode).toString());
                                            }}
                                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                            style={{
                                                background: compactMode ? '#e05c4a' : '#4a4438'
                                            }}
                                        >
                                            <span
                                                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                                style={{
                                                    transform: compactMode ? 'translateX(26px)' : 'translateX(4px)'
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data & Privacy Section */}
                        {activeSection === 'privacy' && (
                            <div className="space-y-6">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily: "'Lora', serif",
                                        color: '#f0ead8'
                                    }}
                                >
                                    Data & Privacy
                                </h2>

                                {/* Export Card */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid #2e2a24'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#5a5248'
                                        }}
                                    >
                                        Export Your Data
                                        <div className="h-px flex-1" style={{ background: '#2e2a24' }} />
                                    </h3>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleExportCSV}
                                            className="flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all"
                                            style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                background: 'transparent',
                                                borderColor: 'rgba(90,158,111,0.3)',
                                                color: '#5a9e6f'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(90,158,111,0.1)';
                                                e.currentTarget.style.borderColor = '#5a9e6f';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.borderColor = 'rgba(90,158,111,0.3)';
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                            Export as CSV
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div
                                    className="rounded-2xl p-7"
                                    style={{
                                        background: '#1a1714',
                                        border: '1px solid rgba(224,92,74,0.3)'
                                    }}
                                >
                                    <h3
                                        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
                                        style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            letterSpacing: '0.2em',
                                            color: '#e05c4a'
                                        }}
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        Danger Zone
                                        <div className="h-px flex-1" style={{ background: 'rgba(224,92,74,0.3)' }} />
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p
                                                    className="font-medium mb-1"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#f0ead8'
                                                    }}
                                                >
                                                    Clear All Contracts
                                                </p>
                                                <p
                                                    className="text-sm"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        color: '#5a5248'
                                                    }}
                                                >
                                                    Delete all your contracts permanently
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleClearAll}
                                                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                                                style={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    background: 'transparent',
                                                    borderColor: 'rgba(224,92,74,0.3)',
                                                    color: '#e05c4a'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(224,92,74,0.1)';
                                                    e.currentTarget.style.borderColor = '#e05c4a';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.borderColor = 'rgba(224,92,74,0.3)';
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Clear All
                                            </button>
                                        </div>

                                        <div className="border-t pt-4" style={{ borderColor: '#2e2a24' }}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p
                                                        className="font-medium mb-1"
                                                        style={{
                                                            fontFamily: "'DM Sans', sans-serif",
                                                            color: '#f0ead8'
                                                        }}
                                                    >
                                                        Delete Account
                                                    </p>
                                                    <p
                                                        className="text-sm"
                                                        style={{
                                                            fontFamily: "'DM Sans', sans-serif",
                                                            color: '#5a5248'
                                                        }}
                                                    >
                                                        Permanently delete your account and all data
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                                                    style={{
                                                        fontFamily: "'DM Sans', sans-serif",
                                                        background: 'transparent',
                                                        borderColor: 'rgba(224,92,74,0.3)',
                                                        color: '#e05c4a'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(224,92,74,0.1)';
                                                        e.currentTarget.style.borderColor = '#e05c4a';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.borderColor = 'rgba(224,92,74,0.3)';
                                                    }}
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
