// src/lib/services/document-actions.ts


import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { DocumentAction } from '@/lib/dms/schema';

export function useDocumentActions() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<DocumentAction[]>(
        session?.user ? '/api/document-actions' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to fetch document actions:', error);
                throw new Error(error.message || 'Failed to fetch document actions');
            }

            const documentActions = await res.json();
            console.log('Fetched document actions:', documentActions);
            return documentActions;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    const createDocumentAction = async (data: Partial<DocumentAction>) => {
        try {
            const res = await fetch('/api/document-actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to create document action:', error);
                throw new Error(error.message || 'Failed to create document action');
            }

            const newDocumentAction = await res.json();
            console.log('Created document action:', newDocumentAction);
            mutate(); // Revalidate the data after creation
            return newDocumentAction;
        } catch (error) {
            console.error('Error creating document action:', error);
            throw error;
        }
    };

    const editDocumentAction = async (id: string, data: Partial<DocumentAction>) => {
        try {
            const res = await fetch(`/api/document-actions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to edit document action:', error);
                throw new Error(error.message || 'Failed to edit document action');
            }

            const updatedDocumentAction = await res.json();
            console.log('Edited document action:', updatedDocumentAction);
            mutate(); // Revalidate the data after editing
            return updatedDocumentAction;
        } catch (error) {
            console.error('Error editing document action:', error);
            throw error;
        }
    };

    const deactivateDocumentAction = async (id: string) => {
        try {
            const res = await fetch(`/api/document-actions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: false }), // Set the `active` field to false
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to deactivate document action:', error);
                throw new Error(error.message || 'Failed to deactivate document action');
            }

            const deactivatedDocumentAction = await res.json();
            console.log('Deactivated document action:', deactivatedDocumentAction);
            mutate(); // Revalidate the data after deactivation
            return deactivatedDocumentAction;
        } catch (error) {
            console.error('Error deactivating document action:', error);
            throw error;
        }
    };

    return {
        documentActions: data,
        error,
        mutate,
        isLoading: isValidating,
        createDocumentAction,
        editDocumentAction,
        deactivateDocumentAction,
    };
}
