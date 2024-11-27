import { z } from 'zod';

export const receiveDocumentSchema = z.object({
    documentCode: z.string().min(1, 'Document Code is required'),
    remarks: z.string().optional(),
    documentAction: z.string().min(1, "Action is required").max(50), 
});

export type ReceiveDocumentData = z.infer<typeof receiveDocumentSchema>;