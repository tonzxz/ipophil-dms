export interface ApiDocument {
    document_id: string
    tracking_code: string
    status: string
    document_code: string
    document_name: string
    classification: string
    document_type: string
    originating_agency: string
    current_agency: string
    from_agency: string | null
    to_agency: string | null
    released_by: string | null
    received_by: string | null
    released_from: string | null
    released_at: string | null
    released_notes: string | null
    received_at: string | null
    completed_at: string | null
    completed_by: string | null
    received_notes: string | null
    received_on: string | null
    released_from_id: string | null
    received_on_id: string | null
    action_requested:string | null
    action_taken:string | null
    sender_action_id:string |null
    recipient_action_id:string |null
    created_by: string
    created_at: string
    updated_at: string
    viewed_at: string | null
}