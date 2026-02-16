import { Condition } from '@/types';
import { Clock, MapPin, Calendar, Tag } from 'lucide-react';

interface ConditionBadgeProps {
    condition: Condition;
}

export default function ConditionBadge({ condition }: ConditionBadgeProps) {
    const icon = () => {
        switch (condition.type) {
            case 'time':
                return <Clock className="mr-1 h-3 w-3" />;
            case 'day':
                return <Calendar className="mr-1 h-3 w-3" />;
            case 'location_tag':
                return <MapPin className="mr-1 h-3 w-3" />;
            case 'situation_tag':
                return <Tag className="mr-1 h-3 w-3" />;
        }
    };

    return (
        <span className="inline-flex items-center text-xs text-[#6b6458]">
            {icon()}
            {condition.value}
        </span>
    );
}
