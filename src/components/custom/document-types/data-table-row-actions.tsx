// src/components/custom/document-types/data-table-row-actions.tsx
'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { documentTypesSchema, DocumentType } from '@/lib/dms/schema'
import { toast } from 'sonner'
import { EditDocumentTypeDialog } from './control/edit-document-type-dialog'
import { useDocumentTypes } from '@/lib/services/document-types'
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
} from "@/components/ui/alert-dialog"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const { editDocumentType, deactivateDocumentType } = useDocumentTypes()
    const [selectedItem, setSelectedItem] = useState<DocumentType | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const documentType = documentTypesSchema.parse(row.original)

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation()
        action()
    }

    // Function to open edit dialog
    const handleEdit = () => {
        setSelectedItem(documentType)
        setIsEditOpen(true)
    }

    // Function to toggle active status
    const handleToggleActive = async () => {
        try {
            if (documentType.active) {
                await deactivateDocumentType(documentType.type_id)
                toast.success('Document type deactivated successfully.')
            } else {
                await editDocumentType(documentType.type_id, { active: true })
                toast.success('Document type activated successfully.')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document type status.')
        }
    }

    // Function to delete document type
    const handleDelete = async () => {
        toast.info('Delete functionality coming soon')
    }

    // Function to handle form submission in edit dialog
    const handleEditSubmit = async (updatedData: Partial<DocumentType>) => {
        try {
            await editDocumentType(documentType.type_id, updatedData)
            toast.success('Document type updated successfully!')
            setIsEditOpen(false)
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document type.')
        }
    }

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
                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleEdit)}
                    >
                        Edit
                    </DropdownMenuItem>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                {documentType.active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {documentType.active ? 'Are you sure you want to deactivate this document type?' : 'Are you sure you want to activate this document type?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {documentType.active ? 'This action will deactivate the document type.' : 'This action will activate the document type.'}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleToggleActive}>
                                    {documentType.active ? 'Deactivate' : 'Activate'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <DropdownMenuSeparator />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isLoading}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this document type?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the document type and remove its data from our servers.
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

            {/* Edit Document Type Dialog */}
            {isEditOpen && (
                <EditDocumentTypeDialog
                    documentType={selectedItem}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </>
    )
}