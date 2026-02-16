'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { ContractStatus } from '@/types';

interface ContractActionsProps {
    contractId: string;
    currentStatus: ContractStatus;
}

export default function ContractActions({ contractId, currentStatus }: ContractActionsProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (status: ContractStatus) => {
        if (!confirm(`Are you sure you want to mark this promise as ${status}?`)) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('contracts')
                .update({ status })
                .eq('id', contractId);

            if (error) throw error;

            router.refresh();
            router.push('/dashboard');
        } catch (error) {
            console.error('Error updating contract:', error);
            alert('Failed to update contract');
        } finally {
            setLoading(false);
        }
    };

    const deleteContract = async () => {
        if (!confirm('Are you sure you want to delete this contract? This cannot be undone.')) return;

        setLoading(true);
        try {
            // First delete conditions (if cascade isn't set up, but let's assume RLS/Foreign keys handle it or we do it manually)
            // Actually Supabase usually handles cascade if configured, but to be safe:
            const { error: conditionsError } = await supabase
                .from('conditions')
                .delete()
                .eq('contract_id', contractId);

            if (conditionsError) console.error('Error deleting conditions:', conditionsError);

            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', contractId);

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Error deleting contract:', error);
            alert('Failed to delete contract');
            setLoading(false);
        }
    };

    if (currentStatus !== 'active') {
        return (
            <div className="mt-8 flex justify-center">
                <button
                    onClick={deleteContract}
                    disabled={loading}
                    className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Contract
                </button>
            </div>
        )
    }

    return (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
                onClick={() => updateStatus('completed')}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
                <Check className="mr-2 h-5 w-5" />
                Promise Kept
            </button>

            <button
                onClick={() => updateStatus('failed')}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
                <X className="mr-2 h-5 w-5" />
                Promise Broken
            </button>

            <button
                onClick={deleteContract}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md border border-[#d4cfc2] bg-white px-6 py-3 text-base font-medium text-[#6b6458] shadow-sm hover:bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-[#c9443a] focus:ring-offset-2 disabled:opacity-50 sm:ml-auto"
            >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete
            </button>
        </div>
    );
}
