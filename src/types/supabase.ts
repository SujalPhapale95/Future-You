export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            contracts: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    body: string
                    category: string
                    status: string
                    created_at: string
                    signature: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    body: string
                    category: string
                    status: string
                    created_at?: string
                    signature?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    body?: string
                    category?: string
                    status?: string
                    created_at?: string
                    signature?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contracts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            conditions: {
                Row: {
                    id: string
                    contract_id: string
                    type: string
                    value: string
                    is_recurring: boolean
                }
                Insert: {
                    id?: string
                    contract_id: string
                    type: string
                    value: string
                    is_recurring?: boolean
                }
                Update: {
                    id?: string
                    contract_id?: string
                    type?: string
                    value?: string
                    is_recurring?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "conditions_contract_id_fkey"
                        columns: ["contract_id"]
                        isOneToOne: false
                        referencedRelation: "contracts"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reminders: {
                Row: {
                    id: string
                    contract_id: string
                    user_id: string
                    triggered_at: string
                    response: string | null
                    responded_at: string | null
                }
                Insert: {
                    id?: string
                    contract_id: string
                    user_id: string
                    triggered_at: string
                    response?: string | null
                    responded_at?: string | null
                }
                Update: {
                    id?: string
                    contract_id?: string
                    user_id?: string
                    triggered_at?: string
                    response?: string | null
                    responded_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reminders_contract_id_fkey"
                        columns: ["contract_id"]
                        isOneToOne: false
                        referencedRelation: "contracts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reminders_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            push_subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    subscription: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    subscription: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    subscription?: Json
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "push_subscriptions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
