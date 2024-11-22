// src/lib/validations/documents/release_documents.ts
import { z } from "zod";

export const releaseDocumentSchema = z.object({
    documentCode: z.string().min(1, "Document code is required"),
    to_agency_id: z.string().uuid("Agency ID must be a valid UUID"),
    remarks: z.string().optional(),
    documentAction: z.string().min(1, "Action is required").max(50), 
});

export type ReleaseDocumentData = z.infer<typeof releaseDocumentSchema>;
