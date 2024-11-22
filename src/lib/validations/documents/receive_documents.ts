import { z } from 'zod';

export const receiveDocumentSchema = z.object({
    documentCode: z.string().min(1, 'Document Code is required'),
});

export type ReceiveDocumentData = z.infer<typeof receiveDocumentSchema>;