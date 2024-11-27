import useSWR from 'swr'
import { ApiDocument } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { JoinedDocument, joinedDocumentSchema } from '@/lib/dms/joined-docs'
import { documentsSchema, Document } from '@/lib/faker/documents/schema'
import { CreateDocumentData } from '@/lib/validations/documents/create_documents'
import { ReleaseDocumentData } from '../validations/documents/release_documents'
import { ReceiveDocumentData } from '../validations/documents/receive_documents'
import { CompleteDocumentData } from '../validations/documents/complete_documents'

import { DocumentTrailsData } from '../validations/documents/document_trails'
import { TrailEntry } from '../types/TrailEntry'

const transformDocument = (apiDoc: ApiDocument): JoinedDocument => {
    const transformed = {
        id: apiDoc.document_id,
        code: apiDoc.tracking_code,
        title: apiDoc.document_name,
        classification: apiDoc.classification,
        type: apiDoc.document_type,
        created_by: apiDoc.created_by,
        date_created: apiDoc.created_at,
        origin_office: apiDoc.originating_agency,
        status: apiDoc.status,
        remarks: '',
        from_agency: apiDoc.from_agency || undefined,
        to_agency: apiDoc.to_agency || undefined,
        released_by: apiDoc.released_by || undefined,
        released_notes: apiDoc.released_notes || undefined,
        received_notes: apiDoc.received_notes || undefined,
        released_from: apiDoc.released_from || undefined,
        released_at: apiDoc.released_at || undefined,
        received_at: apiDoc.received_at || undefined,
        completed_at: apiDoc.completed_at || undefined,
        completed_by: apiDoc.completed_by || undefined,
        action_requested: apiDoc.action_requested|| undefined,
        sender_action_id: apiDoc.sender_action_id|| undefined,
        recipient_action_id: apiDoc.recipient_action_id|| undefined,
        action_taken: apiDoc.action_taken|| undefined,
        receiving_office: apiDoc.current_agency,
        is_received: (apiDoc.received_on === apiDoc.current_agency && apiDoc.status == 'dispatch'),
        date_release: null,
        date_viewed: apiDoc.viewed_at
    }

    return joinedDocumentSchema.parse(transformed)
}

const transformDocumentFake = (apiDoc: ApiDocument): Document => {
    const transformed = {
        id: apiDoc.document_id,
        code: apiDoc.tracking_code,
        title: apiDoc.document_name,
        classification: apiDoc.classification,
        type: apiDoc.document_type,
        created_by: apiDoc.created_by,
        date_created: apiDoc.created_at,
        origin_office: apiDoc.originating_agency,
        status: apiDoc.status,
        remarks: '',
        released_by: apiDoc.released_by || undefined,
        released_notes: apiDoc.released_notes || undefined,
        received_notes: apiDoc.received_notes || undefined,
        released_from: apiDoc.released_from || undefined,
        released_at: apiDoc.released_at || undefined,
        received_at: apiDoc.received_at || undefined,
        completed_at: apiDoc.completed_at || undefined,
        completed_by: apiDoc.completed_by || undefined,
        action_requested: apiDoc.action_requested|| undefined,
        sender_action_id: apiDoc.sender_action_id|| undefined,
        recipient_action_id: apiDoc.recipient_action_id|| undefined,
        action_taken: apiDoc.action_taken|| undefined,
        receiving_office: apiDoc.current_agency,
        is_received: apiDoc.received_by,
        date_release: null,
        date_viewed: apiDoc.viewed_at
    }
    return documentsSchema.parse(transformed)
}

const transformDocumentTrails = (docs:ApiDocument[]): TrailEntry[] =>{
    return docs.map<TrailEntry>((doc:ApiDocument)=> {
       return {
        id: doc.document_id,
        date: doc.released_at!,
        from: doc.from_agency!,
        to: doc.to_agency!,
        isOrigin:false,
        actionRequested: doc.action_requested || 'None',
        actionTaken: doc.action_taken || 'Ongoing' ,
        remarks:  doc.received_by ? doc.received_notes || 'None' : doc.released_notes || 'None',
        deliveryMethod:'personal',
        receiver: doc.received_by || 'Not Yet Received',
        isUrgent: true,
        status: doc.completed_by ? 'completed' : doc.received_by ? 'current' : 'pending',
        timeReceived: doc.received_at ||undefined,
        documentType: doc.document_type,
       }
    })
}

export function useDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch documents');
            }

            const data = (await res.json()) as ApiDocument[];
            console.log(data);
            return data.map(transformDocument);
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );
    const createDocument = async (documentData: CreateDocumentData) => {
        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type_id: documentData.type,
                    classification: documentData.classification,
                    document_name: documentData.title,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.details || 'Failed to create document.');
            }

            const newDoc = await res.json();
            mutate();
            return newDoc;
        } catch (error) {
            throw error;
        }
    };

   
    const cancelDocument = async (documentId: string) => {
        try {
            console.log('Cancelling document:', documentId);
    
            const endpoint = `/api/documents/${documentId}/cancel`;
            console.log('API Endpoint:', endpoint);
    
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to cancel document.');
            }
    
            const updatedDoc = await res.json();
            mutate(); // Revalidate SWR data
            return updatedDoc;
        } catch (error) {
            console.error('Error cancelling document:', error);
            throw error;
        }
    };
    
    
    

    const updateDocument = async (documentId: string, documentData: Partial<CreateDocumentData>) => {
        try {
            const res = await fetch(`/api/documents/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document_name: documentData.title,
                    classification: documentData.classification,
                    type_id: documentData.type,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to update document.');
            }

            const updatedDoc = await res.json();
            mutate(); // Revalidate data after update
            return updatedDoc;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    };
   
    const releaseDocument = async (
        releaseDocumentData: ReleaseDocumentData & { remarks?: string; documentAction: string }
    ) => {

        try {
            console.log("Document Code:", releaseDocumentData.documentCode);
            console.log("To Agency ID:", releaseDocumentData.to_agency_id);
            console.log("Remarks:", releaseDocumentData.remarks);
            console.log("Document Action:", releaseDocumentData.documentAction);

            const endpoint = `/api/documents/${releaseDocumentData.documentCode}/release`;
            console.log("API Endpoint:", endpoint);
    
            const requestBody = JSON.stringify({
                to_agency_id: releaseDocumentData.to_agency_id,
                remarks: releaseDocumentData.remarks || "",
                document_action: releaseDocumentData.documentAction,
            });
            console.log("Request Body:", requestBody);
    
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            });
    
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to release document.");
            }
    
            const updatedDoc = await res.json();
            mutate();
            return updatedDoc;
        } catch (error) {
            console.error("Error releasing document:", error);
            throw error;
        }
    };
    
    

    const receiveDocument = async (receiveDocumentData: ReceiveDocumentData) => {
        try {
            console.log('Document ID:', receiveDocumentData.documentCode);
    
            const endpoint = `/api/documents/${receiveDocumentData.documentCode}/receive`;
            console.log('API Endpoint:', endpoint);
    
            const requestBody = JSON.stringify({
                remarks: receiveDocumentData.remarks || "",
                document_action: receiveDocumentData.documentAction,
            });
            console.log('Request Body:', requestBody);
    
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });
    
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to receive document.');
            }
    
            const updatedDoc = await res.json();
            mutate();
            return updatedDoc;
        } catch (error) {
            console.error('Error receiving document:', error);
            throw error;
        }
    };

    const getDocumentTrails = async (documentTrailsData: DocumentTrailsData) => {
        try {
            console.log('Document ID:', documentTrailsData.tracking_code);
    
            const endpoint = `/api/documents/${documentTrailsData.tracking_code}/trails`;
            console.log('API Endpoint:', endpoint);
    
            const res = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
    
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to receive document.');
            }

            const docRaw = await res.json() as ApiDocument[];
            return transformDocumentTrails(docRaw.reverse());
        } catch (error) {
            console.error('Error receiving document:', error);
            throw error;
        }
    };
    

    
    const completeDocument = async (completeDocumentData: CompleteDocumentData) => {
        try {
            console.log('Document Code:', completeDocumentData.documentCode);
            console.log('Remarks:', completeDocumentData.remarks);
    
            const endpoint = `/api/documents/${completeDocumentData.documentCode}/complete`;
            console.log('API Endpoint:', endpoint);
    
            const requestBody = JSON.stringify({
                remarks: completeDocumentData.remarks,
            });
            console.log('Request Body:', requestBody);
    
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });
    
            if (!res.ok) {
                // Parse and extract the actual error details
                const errorData = await res.json();
                console.error('Failed to complete document:', errorData);
    
                // Display the specific error message from the response
                const errorMessage = errorData.details?.error || errorData.error || 'An error occurred';
                throw new Error(errorMessage);
            }
    
            const updatedDoc = await res.json();
            console.log('Document completed successfully:', updatedDoc);
    
            mutate(); // Revalidate SWR data
            return updatedDoc;
        } catch (error: any) {
            console.error('Error completing document:', error);
            // Re-throw the error to display it properly in the toast
            throw error;
        }
    };
    
    
    const deleteDocument = async (documentId: string) => {
        try {
            console.log('Document ID:', documentId);
            const endpoint = `/api/documents/${documentId}/deactivate`;
            console.log('API Endpoint:', endpoint);
    
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete document.');
            }
    
            const updatedDoc = await res.json();
            mutate(); // Revalidate SWR data
            return updatedDoc;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    };
    


    const fetchOffTransitDocument = async (trackingCode: string) => {
        try {
            console.log('Fetching document:', trackingCode); // Debug log
    
            const res = await fetch(`/api/documents/${trackingCode}/offtransit`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('Failed to fetch off-transit document:', { status: res.status, errorData });
    
                if (res.status === 500) {
                    throw new Error('Server error - please try again');
                }
    
                const errorMessage = errorData.details?.error || errorData.error || `Error ${res.status}: ${res.statusText}`;
                throw new Error(errorMessage);
            }
    
            const document = await res.json();
            return transformDocument(document);
        } catch (error: any) {
            console.error('Error fetching off-transit document:', error);
            throw error;
        }
    };
    
    const fetchInTransitDocument = async (trackingCode: string) => {
        try {
            const res = await fetch(`/api/documents/${trackingCode}/intransit`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to fetch in-transit document:', errorData);
    
                // Extract the error message from the response or fallback to a generic message
                const errorMessage = errorData.details?.error || errorData.error || `Error ${res.status}: ${res.statusText}`;
                throw new Error(errorMessage);
            }
    
            const document = await res.json();
            return transformDocument(document);
        } catch (error: any) {
            console.error('Error fetching in-transit document:', error);
            throw new Error(error.message || 'An unexpected error occurred.');
        }
    };
    

    return {
        documents: data,
        error,
        mutate,
        createDocument,
        releaseDocument,
        receiveDocument,
        cancelDocument,
        completeDocument,
        deleteDocument,
        updateDocument,
        getDocumentTrails,
        fetchOffTransitDocument,
        fetchInTransitDocument,
        isLoading: isValidating
    };
}




export function useIncomingDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/incoming-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch incoming documents')
            }

            const data = await res.json() as ApiDocument[]
            return data.map(transformDocument)
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}

export function useOutgoingDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/outgoing-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch outgoing documents')
            }

            const data = await res.json() as ApiDocument[]
            return data.map(transformDocument)
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}

export function useReceivedDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/received-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch received documents')
            }

            const data = await res.json() as ApiDocument[]
            return data.map(transformDocument)
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}

export function useDispatchDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/dispatch-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch received documents')
            }

            const data = await res.json() as ApiDocument[]
            return data.map(transformDocument)
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}

export function useCompletedDocuments() {
    const { data: session } = useSession()
    const { data, error,mutate, isValidating } = useSWR<JoinedDocument[]>(
        session?.user ? '/api/completed-documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to fetch received documents')
            }

            const data = await res.json() as ApiDocument[]
            return data.map(transformDocument)
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}

export function useDocumentLogs(){
    const { data: session } = useSession();

    const { data, error, mutate , isValidating} = useSWR<Document[]>(
        session?.user ? '/api/documents' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch documents');
            }

            const data = (await res.json()) as ApiDocument[];
            return data.map(transformDocumentFake);
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );
    return {
        documents: data,
        error,
        mutate,
        isLoading: isValidating
    }
}