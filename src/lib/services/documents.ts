import useSWR from 'swr'
import { ApiDocument } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { JoinedDocument, joinedDocumentSchema } from '@/lib/dms/joined-docs'
import { CreateDocumentData } from '@/lib/validations/documents/create_documents'
import { ReleaseDocumentData } from '../validations/documents/release_documents'
import { ReceiveDocumentData } from '../validations/documents/receive_documents'
import { CompleteDocumentData } from '../validations/documents/complete_documents'
import { useEffect } from 'react'
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
        is_received: !!apiDoc.received_by,
        date_release: null,
        date_viewed: apiDoc.viewed_at
    }

    return joinedDocumentSchema.parse(transformed)
}

const transformDocumentTrails = (docs:ApiDocument[]): TrailEntry[] =>{
    return docs.map<TrailEntry>((doc:ApiDocument)=> {
       return {
        id: doc.document_id,
        date: doc.released_at!,
        from: doc.from_agency!,
        to: doc.to_agency!,
        isOrigin:false,
        actionRequested: doc.action_requested ?? 'None',
        actionTaken: doc.action_taken ?? 'Completed',
        remarks: doc.received_notes ?? 'None',
        deliveryMethod:'personal',
        receiver: doc.received_by ?? 'Not Yet Received',
        isUrgent: true,
        status: doc.completed_by ? 'completed' : doc.received_by ? 'current' : 'pending',
        timeReceived: doc.received_at ||undefined,
        documentType: doc.document_type,
       }
    })
}

export function useDocuments() {
    const { data: session } = useSession();

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
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
            return data.map(transformDocument);
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits' && message != 'documents') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes


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
    
            const requestBody = JSON.stringify({});
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
    
            // const requestBody = JSON.stringify({});
            // console.log('Request Body:', requestBody);
    
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
            const res = await fetch(`/api/documents/${trackingCode}/offtransit`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to fetch off-transit document:', errorData);
    
                // Extract the error message from the response or fallback to a generic message
                const errorMessage = errorData.details?.error || errorData.error || `Error ${res.status}: ${res.statusText}`;
                throw new Error(errorMessage);
            }
    
            const document = await res.json();
            return transformDocument(document);
        } catch (error: any) {
            console.error('Error fetching off-transit document:', error);
            throw new Error(error.message || 'An unexpected error occurred.');
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
        createDocument,
        releaseDocument,
        receiveDocument,
        completeDocument,
        deleteDocument,
        getDocumentTrails,
        fetchOffTransitDocument,
        fetchInTransitDocument,
        isLoading: !data && !error,
    };
}




export function useIncomingDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
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

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes


    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}

export function useOutgoingDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
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

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes


    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}

export function useReceivedDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
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

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes


    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}

export function useDispatchDocuments() {
    const { data: session } = useSession()

    const { data, error, mutate } = useSWR<JoinedDocument[]>(
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

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits' && message != 'documents') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes


    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}

export function useCompletedDocuments() {
    const { data: session } = useSession()
    const { data, error,mutate } = useSWR<JoinedDocument[]>(
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

    useEffect(() => {
        if (!session?.user) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return
        }
        const socketUrl = baseUrl.replace('https://', 'wss://').replaceAll('http://', 'ws://');
        const authorizedSocketUrl = socketUrl + '?token=' + session?.user.accessToken
        const socket = new WebSocket(authorizedSocketUrl);
        // When a message is received, trigger data mutation to refresh the documents
        socket.onmessage = (event) => {
          const message = event.data;
          if(message != 'transits') return;
          // Mutate the data to re-fetch the documents
          mutate();
        };
    
        // Clean up the WebSocket connection when the component is unmounted or session changes
        return () => {
          socket.close();
        };
      }, [session?.user, mutate]); // Re-run effect if session changes

    return {
        documents: data,
        error,
        mutate,
        isLoading: !data && !error,
    }
}

