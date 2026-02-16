import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        return NextResponse.json({ error: 'Service Role Key not configured' }, { status: 500 });
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);

    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

        const { data: contracts, error } = await supabase
            .from('contracts')
            .select('*, conditions(*)')
            .eq('status', 'active');

        if (error) throw error;

        let processedCount = 0;

        for (const contract of contracts) {
            let shouldRemind = false;

            for (const condition of contract.conditions) {
                if (condition.type === 'time') {
                    const [condHour, condMinute] = condition.value.split(':').map(Number);
                    if (condHour === currentHour && condMinute === currentMinute) {
                        shouldRemind = true;
                    }
                } else if (condition.type === 'day') {
                    if (condition.value === currentDay) {
                        shouldRemind = true;
                    }
                }
            }

            if (shouldRemind) {
                const { data: subscriptionData } = await supabase
                    .from('push_subscriptions')
                    .select('subscription')
                    .eq('user_id', contract.user_id)
                    .single();

                if (subscriptionData?.subscription) {
                    console.log(`[SIMULATION] Sending notification for contract: ${contract.title}`);
                    // NOTE: Actual sending disabled due to build issues with web-push in API routes.
                    // In production, this would use a dedicated worker or external service.
                    processedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, processed: processedCount, totalActive: contracts.length });
    } catch (error: unknown) {
        console.error('Cron Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
