// src/lib/services/document-types.ts

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { DocumentType } from '@/lib/dms/schema';

export function useDocumentTypes() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<DocumentType[]>(
        session?.user ? '/api/document-types' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to fetch document types:', error);
                throw new Error(error.message || 'Failed to fetch document types');
            }

            const documentTypes = await res.json();
            console.log('Fetched document types:', documentTypes);
            return documentTypes;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    const createDocumentType = async (data: Partial<DocumentType>) => {
        try {
            const res = await fetch('/api/document-types', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to create document type:', error);
                throw new Error(error.message || 'Failed to create document type');
            }

            const newDocumentType = await res.json();
            console.log('Created document type:', newDocumentType);
            mutate(); // Revalidate the data after creation
            return newDocumentType;
        } catch (error) {
            console.error('Error creating document type:', error);
            throw error;
        }
    };

    const editDocumentType = async (id: string, data: Partial<DocumentType>) => {
        try {
            const res = await fetch(`/api/document-types/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to edit document type:', error);
                throw new Error(error.message || 'Failed to edit document type');
            }

            const updatedDocumentType = await res.json();
            console.log('Edited document type:', updatedDocumentType);
            mutate(); // Revalidate the data after editing
            return updatedDocumentType;
        } catch (error) {
            console.error('Error editing document type:', error);
            throw error;
        }
    };

    const deactivateDocumentType = async (id: string) => {
        try {
            const res = await fetch(`/api/document-types/${id}`, {
                method: 'DELETE', // Use DELETE for deactivation
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Failed to deactivate document type:', error);
                throw new Error(error.message || 'Failed to deactivate document type');
            }

            const deactivatedDocumentType = await res.json();
            console.log('Deactivated document type:', deactivatedDocumentType);
            mutate(); // Revalidate the data after deactivation
            return deactivatedDocumentType;
        } catch (error) {
            console.error('Error deactivating document type:', error);
            throw error;
        }
    };

    return {
        documentTypes: data,
        error,
        mutate,
        isLoading: isValidating,
        createDocumentType,
        editDocumentType,
        deactivateDocumentType,
    };
}
