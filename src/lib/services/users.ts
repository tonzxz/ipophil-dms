// src\lib\services\users.ts
'use client'

import useSWR from 'swr/immutable'

import { z } from 'zod'
import { compareDesc } from 'date-fns'
import { useSession } from 'next-auth/react'
import { extendedUserSchema } from '../dms/schema'
import { CreateUserData, createUserSchema, UpdateUserData } from '@/lib/validations/user/create'

export type ExtendedUser = z.infer<typeof extendedUserSchema>

export function useUsers() {
    const { data: session } = useSession()

    const { data, error, mutate, isValidating } = useSWR<ExtendedUser[]>(
        session?.user ? '/api/users' : null,
        async (url) => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.user?.accessToken}`,
                    },
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message || 'Failed to fetch users')
                }

                const data = await res.json()

                // Parse and validate the response data
                const users = extendedUserSchema.array().parse(
                    data.map((user: ExtendedUser) => ({
                        ...user,
                        agency_name: user.agency_name ?? null,
                        created_at: new Date(user.created_at).toISOString(),
                        updated_at: user.updated_at ? new Date(user.updated_at).toISOString() : null,
                    }))
                )

                // Sort users by creation date
                return users.sort((a, b) => compareDesc(
                    new Date(a.created_at),
                    new Date(b.created_at)
                ))
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.error('Validation error:', JSON.stringify(error.errors, null, 2))
                }
                throw error
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    const createUser = async (userData: CreateUserData) => {
        try {
            // Validate the user data
            const validatedData = createUserSchema.parse(userData)

            // Create FormData instance
            const formData = new FormData()
            Object.entries(validatedData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Handle File objects separately
                    if (value instanceof File) {
                        formData.append(key, value)
                    } else {
                        formData.append(key, String(value))
                    }
                }
            })

            // Make the API request to create the user
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to create user')
            }

            const newUser = await res.json()

            mutate();

            return newUser
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation error:', JSON.stringify(error.errors, null, 2))
            }
            throw error
        }
    }

    const updateUser = async (userId: string, userData: UpdateUserData) => {
        try {
            // Create FormData instance
            const formData = new FormData()

            // Add all fields to FormData
            Object.entries(userData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (value instanceof File) {
                        formData.append(key, value)
                    } else if (typeof value === 'string' || typeof value === 'boolean') {
                        formData.append(key, String(value))
                    }
                }
            })

            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to update user')
            }

            const updatedUser = await res.json()


            mutate();

            return updatedUser
        } catch (error) {
            console.error('Error updating user:', error)
            throw error
        }
    }

    const deleteUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to delete user')
            }

            // Update the local data by removing the deleted user
            await mutate(
                (prevUsers) => prevUsers?.filter((user) => user.user_id !== userId),
                false
            )

            return true
        } catch (error) {
            console.error('Error deleting user:', error)
            throw error
        }
    }

    const deactivateUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/deactivate`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to deactivate user')
            }

            // Update the local data by marking the user as inactive
            mutate();

            return true
        } catch (error) {
            console.error('Error deactivating user:', error)
            throw error
        }
    }

    const reactivateUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/reactivate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to reactivate user')
            }

            // Update the local data by marking the user as active
            mutate();

            return true
        } catch (error) {
            console.error('Error reactivating user:', error)
            throw error
        }
    }

    const getUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to fetch user')
            }

            const userData = await res.json()
            return extendedUserSchema.parse({
                ...userData,
                agency_name: userData.agency_name ?? null,
                created_at: new Date(userData.created_at).toISOString(),
                updated_at: userData.updated_at
                    ? new Date(userData.updated_at).toISOString()
                    : null,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation error:', JSON.stringify(error.errors, null, 2))
            }
            throw error
        }
    }

    return {
        users: data,
        error,
        mutate,
        isLoading: isValidating,
        createUser,
        updateUser,
        deleteUser,
        deactivateUser,
        reactivateUser,
        getUser,
    }
}