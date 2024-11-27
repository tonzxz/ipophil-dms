'use client';

import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { documentsSchema, Document } from '@/lib/faker/documents/schema';
import { DocumentDialog } from '@/components/custom/common/document-dialog';
import { ScanDocumentForm } from '../common/add-document/scan-document-form';
import { AddDocumentDialog } from '@/components/custom/common/add-document/add-document-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDocuments } from '@/lib/services/documents';
import { CompleteModal } from '../recieved-documents/completemodal';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
    const { completeDocument } = useDocuments();
    const { cancelDocument } = useDocuments();


    const document = documentsSchema.parse(row.original);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(document.code);
        toast.success('Document Code copied to clipboard');
    };

    const handleView = () => {
        setSelectedItem(document);
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleRelease = () => {
        setIsReleaseModalOpen(true);
    };

    const handleComplete = () => {
        setIsCompleteModalOpen(true);
    };


    const handleCancel = async () => {
        try {
            if (!document?.id) {
                throw new Error('Document Code is missing.');
            }
            await cancelDocument(document.code); 
    
            toast.success('Document cancelled successfully.');
        } catch (error: any) {
            console.error('Error cancelling document:', error);
            toast.error(error.message || 'Failed to cancel document.');
        }
    };
    

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/documents/${document.id}/deactivate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete document.');
            }

            toast.success('Document successfully deleted.');
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Failed to delete document.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isLoading}
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={(e) => handleAction(e, handleCopyCode)}>
                        Copy Code
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => handleAction(e, handleView)}>
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => handleAction(e, handleEdit)}>
                        Edit
                    </DropdownMenuItem>

                    {document?.status === 'dispatch' && (
                    <DropdownMenuItem onClick={(e) => handleAction(e, handleRelease)}>
                        Release
                    </DropdownMenuItem>
                    )}

                    {document?.status === 'dispatch' && (
                    <DropdownMenuItem onClick={(e) => handleAction(e, handleComplete)}>
                        Complete
                    </DropdownMenuItem>
                    )}

                    {document?.status === 'intransit' && (
                    <DropdownMenuItem onClick={(e) => handleAction(e, handleCancel)}>
                        Cancel
                    </DropdownMenuItem>
                    )}


                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isLoading}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the document and remove its data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* View Modal */}
            <DocumentDialog
                item={selectedItem}
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />

            {/* Edit Modal */}
            {isEditModalOpen && (
                <AddDocumentDialog
                    onCloseAction={() => setIsEditModalOpen(false)}
                    actionType="Edit"
                    initialData={document} // Pass document data to pre-fill the form
                />
            )}

            {/* Release Modal */}
            {isReleaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <button
                            onClick={() => setIsReleaseModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>

                        <ScanDocumentForm
                            onSubmit={(data) => {
                                console.log('Form data:', data);
                                setIsReleaseModalOpen(false);
                            }}
                            onClose={() => setIsReleaseModalOpen(false)}
                            actionType="Release"
                            initialDocumentCode={document.code}
                        />
                    </div>
                </div>
            )}
            <CompleteModal
                    open={isCompleteModalOpen}
                    onClose={() => setIsCompleteModalOpen(false)}
                    onSubmit={async (remarks) => {
                        try {
                            await completeDocument({
                                documentCode: document.code,
                                remarks,
                            });

                            toast.success('Document completed successfully.');
                            setIsCompleteModalOpen(false); 
                        } catch (error: any) {
                            toast.error(error.message || 'Failed to complete document.');
                        }
                    }}
                    initialRemarks=""
                />
        </>
    );
}