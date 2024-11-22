// src/components/custom/document-types/data-table-row-actions.tsx
'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { documentTypesSchema, DocumentType } from '@/lib/dms/schema';
import { toast } from 'sonner';
import { EditDocumentTypeDialog } from './control/edit-document-type-dialog';
import { useDocumentTypes } from '@/lib/services/document-types';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const { editDocumentType, deactivateDocumentType } = useDocumentTypes(); // Access services
    const [selectedItem, setSelectedItem] = useState<DocumentType | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false); // State to manage edit dialog visibility
    const documentType = documentTypesSchema.parse(row.original);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    // Function to open edit dialog
    const handleEdit = () => {
        setSelectedItem(documentType);
        setIsEditOpen(true);
    };

    // Function to toggle active status
    const handleToggleActive = async () => {
        try {
            if (documentType.active) {
                await deactivateDocumentType(documentType.type_id); // Deactivate the document type
                toast.success('Document type deactivated successfully.');
            } else {
                await editDocumentType(documentType.type_id, { active: true }); // Activate the document type
                toast.success('Document type activated successfully.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document type status.');
        }
    };

    // Function to delete document type (currently not implemented)
    const handleDelete = () => {
        toast.info('Delete functionality coming soon');
    };

    // Function to handle form submission in edit dialog
    const handleEditSubmit = async (updatedData: Partial<DocumentType>) => {
        try {
            await editDocumentType(documentType.type_id, updatedData); // Call edit API
            toast.success('Document type updated successfully!');
            setIsEditOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document type.');
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

                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleToggleActive)}
                    >
                        {/* {documentType.active ? 'Deactivate' : 'Activate'} */}
                        Delete
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleDelete)}
                        className="text-red-600"
                    >
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem> */}
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
    );
}
