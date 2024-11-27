import { z } from 'zod';

export const completeDocumentSchema = z.object({
    documentCode: z.string().min(1, 'Document Code is required'),
    remarks: z.string().optional(),
});

export type CompleteDocumentData = z.infer<typeof completeDocumentSchema>;
