import { z } from 'zod';

export const documentTrailsSchema = z.object({
    tracking_code: z.string().min(1, 'Tracking code is required'),
});

export type DocumentTrailsData = z.infer<typeof documentTrailsSchema>;