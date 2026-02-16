import { ContractStatus } from '@/types';

interface StatusBadgeProps {
    status: ContractStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        active: 'bg-green-100 text-green-800 border-green-200',
        completed: 'bg-blue-100 text-blue-800 border-blue-200',
        paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        failed: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
        active: 'Active',
        completed: 'Completed',
        paused: 'Paused',
        failed: 'Failed',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}
