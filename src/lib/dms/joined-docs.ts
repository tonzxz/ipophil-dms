// src\lib\dms\joined-docs.ts
import { z } from 'zod'
import { doc_classification, doc_status } from './data'

// Helper to create enum from data array
const createEnumFromData = (data: Array<{ value: string }>) =>
    data.map(item => item.value) as [string, ...string[]]

export const joinedDocumentSchema = z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    classification: z.enum(createEnumFromData(doc_classification)),
    type: z.string(),
    created_by: z.string(),
    date_created: z.string(),
    origin_office: z.string(),
    status: z.enum(createEnumFromData(doc_status)),
    remarks: z.string().optional(),
    from_agency: z.string().optional(),
    to_agency: z.string().optional(),
    released_by: z.string().optional(),
    received_at: z.string().optional(),
    released_at: z.string().optional(),
    completed_at: z.string().optional(),
    completed_by: z.string().optional(),
    received_notes: z.string().optional(),
    released_notes: z.string().optional(),
    released_from: z.string().optional(),
    sender_action_id: z.string().optional(),
    recipient_action_id: z.string().optional(),
    action_requested: z.string().optional(),
    receiving_office: z.string().optional(),
    action_taken: z.string().optional(),
    is_received: z.boolean().optional(),
    date_release: z.string().nullable().optional(),
    date_viewed: z.string().nullable().optional(),
    transit_status: z.enum(['incoming', 'outgoing', 'process']).optional(),
})

export type JoinedDocument = z.infer<typeof joinedDocumentSchema>