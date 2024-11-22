'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner'; // Ensure 'sonner' is installed

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { documentsSchema, Document } from '@/lib/faker/documents/schema'; // Import Document type
import { DocumentDialog } from '@/components/custom/common/document-dialog'; // Assuming this component exists
import { ScanDocumentForm } from '../common/add-document/scan-document-form'; // Assuming this component exists

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null); // Use Document | null as type
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState<boolean>(false);
    const document = documentsSchema.parse(row.original);

    // Function to Copy ID
    const handleCopyID = () => {
        navigator.clipboard.writeText(document.code);
        toast.success('Document ID copied to clipboard');
    };

    // Function to view document
    const handleView = () => {
        setSelectedItem(document);
    };

    // Function to edit document
    const handleEdit = () => {
        toast.info('Edit functionality coming soon');
    };

    // Function to release document
    const handleRelease = () => {
        setIsReleaseModalOpen(true);
    };

    // Function to delete document
    const handleDelete = async () => {
        try {
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
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={handleCopyID}>
                        Copy Code
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleView}>
                        View
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem onClick={handleEdit}>
                        Edit
                    </DropdownMenuItem> */}
{/* 
                    <DropdownMenuItem onClick={handleRelease}>
                        Release
                    </DropdownMenuItem> */}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleDelete}>
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Document Dialog for viewing document details */}
            {selectedItem && (
                <DocumentDialog
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}

            {/* Release Modal with 'X' button for closing */}
            {isReleaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        {/* Close Button */}
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
                        />
                    </div>
                </div>
            )}
        </>
    );
}
