export type ContractStatus = 'active' | 'completed' | 'paused' | 'failed';
export type ConditionType = 'time' | 'day' | 'location_tag' | 'situation_tag';
export type ReminderResponse = 'kept' | 'broke' | 'skipped' | null;

export interface Contract {
    id: string;
    user_id: string;
    title: string;
    body: string;
    category: string;
    status: ContractStatus;
    created_at: string;
    signature?: string;
}

export interface Condition {
    id: string;
    contract_id: string;
    type: ConditionType;
    value: string;
    is_recurring: boolean;
}

export interface Reminder {
    id: string;
    contract_id: string;
    user_id: string;
    triggered_at: string;
    response: ReminderResponse;
    responded_at: string | null;
}

export interface ContractWithConditions extends Contract {
    conditions: Condition[];
}

export interface ContractWithStats extends Contract {
    conditions: Condition[];
    kept_count: number;
    broke_count: number;
    last_reminded: string | null;
}
