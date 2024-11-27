'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DocumentAction, documentActionsSchema } from '@/lib/dms/schema';
import { toast } from 'sonner';
import { EditDocumentActionDialog } from './control/edit-document-action-dialog';
import { useDocumentActions } from '@/lib/services/document-actions';
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
                await deactivateDocumentAction(documentAction.action_id);
                toast.success('Document action deactivated successfully.');
            } else {
                await editDocumentAction(documentAction.action_id, { active: true });
                toast.success('Document action activated successfully.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update document action status.');
        }
    };

    const handleDelete = () => {
        toast.info('Delete functionality coming soon');
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                {documentAction.active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {documentAction.active ? 'Are you sure you want to deactivate this document action?' : 'Are you sure you want to activate this document action?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {documentAction.active ? 'This action will deactivate the document action.' : 'This action will activate the document action.'}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleToggleActive}>
                                    {documentAction.active ? 'Deactivate' : 'Activate'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this document action?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the document action and remove its data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditOpen && (
                <EditDocumentActionDialog
                    documentAction={selectedItem}
                    onClose={() => setIsEditOpen(false)}
                // onSubmit={handleEditSubmit}
                />
            )}
        </>
    );
}