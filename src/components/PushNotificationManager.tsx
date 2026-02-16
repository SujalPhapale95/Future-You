'use client';

import { createClient } from '@/lib/supabase/client';
import { urlBase64ToUint8Array } from '@/lib/notifications-client';
import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

export default function PushNotificationManager() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            // Register service worker if not already registered (handled by next-pwa usually, but good to check)
            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then((sub) => {
                    if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime)) {
                        setSubscription(sub);
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, []);

    const subscribeToPush = async () => {
        if (!registration) return;

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            setSubscription(sub);
            setIsSubscribed(true);

            // Save to Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase.from('push_subscriptions').upsert({
                    user_id: session.user.id,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    subscription: sub.toJSON() as any,
                });
            }

            console.log('Web Push Subscribed!');
        } catch (error) {
            console.error('Failed to subscribe to Push', error);
            alert('Failed to enable notifications. Please check your browser settings.');
        }
    };

    const unsubscribeFromPush = async () => {
        if (!subscription) return;
        try {
            await subscription.unsubscribe();
            setSubscription(null);
            setIsSubscribed(false);
            // Optionally remove from Supabase, but keeping it for history/other devices is fine for now
            console.log('Web Push Unsubscribed!');
        } catch (error) {
            console.error('Failed to unsubscribe', error);
        }
    };

    if (!isSubscribed) {
        return (
            <button
                onClick={subscribeToPush}
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.08em',
                    background: 'transparent',
                    borderColor: 'var(--border-bright)',
                    color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-amber)';
                    e.currentTarget.style.color = 'var(--accent-amber)';
                    e.currentTarget.style.boxShadow = '0 0 12px var(--glow-amber)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-bright)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <Bell className="h-3.5 w-3.5" />
                Enable Notifications
            </button>
        );
    }

    return (
        <button
            onClick={unsubscribeFromPush}
            className="flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200"
            style={{
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.08em',
                background: 'transparent',
                borderColor: 'var(--accent-green)',
                color: 'var(--accent-green)'
            }}
        >
            <BellOff className="h-3.5 w-3.5" />
            Notifications Enabled
        </button>
    );
}
