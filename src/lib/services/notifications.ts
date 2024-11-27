import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Notification } from '../types/notifications';

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

export function useNotifications() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<Notification[]>(
        session?.user ? `/api/notifications` : null,
        (url) => fetcher(url, session),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    

    return {
        notifications: data || [],
        error,
        mutate,
        isLoading: isValidating
    };
}
