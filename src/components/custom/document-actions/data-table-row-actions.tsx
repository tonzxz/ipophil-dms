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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DocumentAction, documentActionsSchema } from '@/lib/dms/schema';
import { toast } from 'sonner';
import { EditDocumentActionDialog } from './control/edit-document-action-dialog';
import { useDocumentActions } from '@/lib/services/document-actions';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const { editDocumentAction, deactivateDocumentAction } = useDocumentActions();
    const [selectedItem, setSelectedItem] = useState<DocumentAction | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const documentAction = documentActionsSchema.parse(row.original);

    const handleEdit = () => {
        setSelectedItem(documentAction);
        setIsEditOpen(true);
    };

    const handleToggleActive = async () => {
        try {
            if (documentAction.active) {
                await deactivateDocumentAction(documentAction.action_id );
                toast.success('Document action deactivated successfully.');
            } else {
                await editDocumentAction(documentAction.action_id, { active: true });
                toast.success('Document action activated successfully.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document action status.');
        }
    };
    
    const handleEditSubmit = async (updatedData: Partial<DocumentAction>) => {
        try {
            await editDocumentAction(documentAction.action_id, updatedData);
            toast.success('Document action updated successfully!');
            setIsEditOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document action.');
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
                    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleActive}>
                        {/* {documentAction.active ? 'Deactivate' : 'Activate'} */}
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditOpen && (
                <EditDocumentActionDialog
                documentAction={selectedItem}
                onClose={() => setIsEditOpen(false)}
            />
            )}
        </>
    );
}
