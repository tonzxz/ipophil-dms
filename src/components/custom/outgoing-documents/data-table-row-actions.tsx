'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner' // Ensure 'sonner' is installed

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { documentsSchema, Document } from '@/lib/faker/documents/schema' // Import Document type
import { DocumentDialog } from '@/components/custom/common/document-dialog' // Assuming this component exists
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
import { useDocuments } from '@/lib/services/documents'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null) // Use Document | null as type
    const [isLoading, setIsLoading] = useState(false)
    const document = documentsSchema.parse(row.original)
    const { cancelDocument } = useDocuments();

    // Function to Copy ID
    const handleCopyID = () => {
        navigator.clipboard.writeText(document.code)
        toast.success('Document ID copied to clipboard')
    }

    // Function to view document
    const handleView = () => {
        setSelectedItem(document) // Set document to selectedItem, which now accepts Document type
    }

    // Function to edit document
    const handleEdit = () => {
        toast.info('Edit functionality coming soon')
    }

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
    

    // Function to delete document
    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/documents/${document.id}/deactivate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || 'Failed to delete document.')
            }

            const deletedDoc = await res.json()
            toast.success('Document successfully deleted.')
        } catch (error) {
            console.error('Error deleting document:', error)
            toast.error('Failed to delete document.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                    >
                        <DotsHorizontalIcon className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-[160px]'>
                    <DropdownMenuItem onClick={handleCopyID}>
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleView}>
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleEdit}>
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleCancel}>
                        Cancel
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

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

            {/* Document Dialog for viewing document details */}
            {selectedItem && (
                <DocumentDialog
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    )
}