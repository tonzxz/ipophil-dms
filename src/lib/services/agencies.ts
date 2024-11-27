// // src/lib/services/agencies.ts
// import useSWR from 'swr'
// import { useSession } from 'next-auth/react'
// import { Agency } from '../types/agency'

// export function useAgencies() {
//     const { data: session } = useSession()

//     const { data, error, mutate } = useSWR<Agency[]>(
//         session?.user ? '/api/agencies' : null,
//         async (url) => {
//             const res = await fetch(url, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             })

//             if (!res.ok) {
//                 const error = await res.json()
//                 console.error('Failed to fetch agencies:', error)
//                 throw new Error(error.message || 'Failed to fetch agencies')
//             }

//             const agencies = await res.json()
//             // console.log('Fetched agencies:', agencies)
//             return agencies
//         },
//         {
//             revalidateOnFocus: false,
//             revalidateIfStale: false,
//             shouldRetryOnError: false,
//         }
//     )

//     // console.log('useAgencies hook:', { data, error })

//     return {
//         agencies: data,
//         error,
//         mutate,
//         isLoading: !data && !error,
//     }
// }

// // src/lib/services/agencies.ts
// import useSWR from 'swr'
// import { useSession } from 'next-auth/react'
// import { Agency } from '../types/agency'

// export function useAgencies() {
//     const { data: session } = useSession()

//     const { data, error, mutate } = useSWR<Agency[]>(
//         session?.user ? '/api/agencies' : null,
//         async (url) => {
//             const res = await fetch(url, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             })

//             if (!res.ok) {
//                 const error = await res.json()
//                 console.error('Failed to fetch agencies:', error)
//                 throw new Error(error.message || 'Failed to fetch agencies')
//             }

//             const agencies = await res.json()
//             // console.log('Fetched agencies:', agencies)
//             return agencies
//         },
//         {
//             revalidateOnFocus: false,
//             revalidateIfStale: false,
//             shouldRetryOnError: false,
//         }
//     )

//     // console.log('useAgencies hook:', { data, error })

//     return {
//         agencies: data,
//         error,
//         mutate,
//         isLoading: !data && !error,
//     }
// }

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Agency } from '../types/agency';

const fetcher = async (url: string, session: any) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.error('Failed to fetch:', error);
        throw new Error(error.message || 'Failed to fetch data');
    }

    return res.json();
};

export function useAgencies() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<Agency[]>(
        session?.user ? `/api/agencies` : null,
        (url) => fetcher(url, session),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    const createAgency = async (agencyData: Partial<Agency>) => {
        if (!session?.user?.accessToken) {
            throw new Error('Unauthorized');
        }

        const res = await fetch('/api/agencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`,
            },
            body: JSON.stringify(agencyData),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('Failed to create agency:', error);
            throw new Error(error.message || 'Failed to create agency');
        }

        const newAgency = await res.json();

        // Optimistically update the data
        mutate((agencies) => [...(agencies || []), newAgency], false);

        return newAgency;
    };

    const updateAgency = async (agencyId: string, agencyData: Partial<Agency>) => {
        if (!session?.user?.accessToken) {
            throw new Error('Unauthorized');
        }

        const res = await fetch(`/api/agencies/${agencyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`,
            },
            body: JSON.stringify(agencyData),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('Failed to update agency:', error);
            throw new Error(error.message || 'Failed to update agency');
        }

        const updatedAgency = await res.json();

        // Optimistically update the data
        mutate((agencies) =>
            (agencies || []).map((agency) =>
                agency.agency_id === agencyId ? { ...agency, ...updatedAgency } : agency
            ),
            false
        );

        return updatedAgency;
    };

    const deactivateAgency = async (agencyId: string) => {
        if (!session?.user?.accessToken) {
            throw new Error('Unauthorized');
        }

        const res = await fetch(`/api/agencies/${agencyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.accessToken}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('Failed to deactivate agency:', error);
            throw new Error(error.message || 'Failed to deactivate agency');
        }

        // Optimistically remove the agency from the data
        mutate((agencies) => (agencies || []).filter((agency) => agency.agency_id !== agencyId), false);

        return true;
    };

    return {
        agencies: data || [],
        error,
        mutate,
        isLoading: isValidating,
        createAgency,
        updateAgency,
        deactivateAgency,
    };
}
