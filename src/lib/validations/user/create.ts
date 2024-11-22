// src\lib\validations\user\create.ts
import { userRoleEnum, type User } from '@/lib/dms/schema'
import { z } from 'zod'

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Base schema for form inputs
const createUserBaseSchema = z.object({
    agency_id: z.string().uuid("Invalid agency ID"),
    first_name: z.string()
        .min(1, "First name is required")
        .max(255, "First name must be less than 255 characters")
        .regex(/^[a-zA-Z\s-']+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
    last_name: z.string()
        .min(1, "Last name is required")
        .max(255, "Last name must be less than 255 characters")
        .regex(/^[a-zA-Z\s-']+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
    middle_name: z.string()
        .max(255, "Middle name must be less than 255 characters")
        .nullable()
        .optional(),
    email: z.string()
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters")
        .transform(email => email.toLowerCase()),
    role: userRoleEnum.default('user'),
    title: z.string()
        .min(1, "Job title is required")
        .max(255, "Job title must be less than 255 characters"),
    type: z.string()
        .min(1, "Job type is required")
        .max(255, "Job type must be less than 255 characters"),
    user_name: z.string().max(255).nullable().optional(),
    active: z.boolean().default(true),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(255, "Password must be less than 255 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
})

// Base avatar schema that accepts both File and string (base64)
const avatarSchema = z.union([
    z.custom<File>((val) => val instanceof File)
        .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `Max image size is 5MB`)
        .refine(
            (file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png, and .webp formats are supported"
        ),
    z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "Invalid image format"),
])

// Create schema
export const createUserSchema = createUserBaseSchema.extend({
    avatar: avatarSchema.nullable().optional(),
})

// Update schema (makes all fields optional)
export const updateUserSchema = createUserBaseSchema.partial().extend({
    avatar: avatarSchema.nullable().optional(),

    /**
     * 
     * commented for now:
     * 
     * password: z.string()
     *     .min(8, "Password must be at least 8 characters long")
     *     .max(255, "Password must be less than 255 characters")
     *     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
     *     .optional()
     *     .nullable()
     *     .transform(value => value || null),
     * 
     */

})

// Helper function to convert File to base64 string
export const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })
}

// Helper function to generate username
export const generateUsername = (email: string): string => {
    return email.split('@')[0]
}

// Transform function for API response
export const transformCreateUserToResponse = async (
    data: z.infer<typeof createUserSchema>,
    userId: string,
): Promise<User> => {
    let avatarBase64: string | null = null

    if (data.avatar instanceof File) {
        avatarBase64 = await fileToBase64(data.avatar)
    }

    return {
        user_id: userId,
        agency_id: data.agency_id,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        email: data.email,
        role: data.role,
        title: data.title,
        type: data.type,
        user_name: data.user_name ?? generateUsername(data.email),
        active: data.active,
        avatar: avatarBase64,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    } satisfies User
}

// Export types
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>