// src/lib/services/agencies.ts
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Agency } from '../types/agency'

export function useAgencies() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<Agency[]>(
        session?.user ? '/api/agencies' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                console.error('Failed to fetch agencies:', error)
                throw new Error(error.message || 'Failed to fetch agencies')
            }

            const agencies = await res.json()
            // console.log('Fetched agencies:', agencies)
            return agencies
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    // console.log('useAgencies hook:', { data, error })

    return {
        agencies: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}
