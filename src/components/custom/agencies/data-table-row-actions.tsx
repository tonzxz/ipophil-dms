'use client';

import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditAgenciesDialog } from './control/edit-agencies-dialog';
import { Agency } from '@/lib/types/agency';
import { toast } from 'sonner';
import { useAgencies } from '@/lib/services/agencies';
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
    mutateAgencies: () => void; // Function to trigger data refresh
}

export function DataTableRowActions<TData>({
    row,
    mutateAgencies,
}: DataTableRowActionsProps<TData>) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { deactivateAgency } = useAgencies(); // Use deactivateAgency from the hook
    const agency = row.original as Agency;

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deactivateAgency(agency.agency_id);
            toast.success('Agency deactivated successfully');
            mutateAgencies(); // Trigger data re-fetch
        } catch (error: any) {
            toast.error(error.message || 'Failed to deactivate agency');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span> •••
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>Edit</DropdownMenuItem>
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
                                <AlertDialogTitle>Are you sure you want to delete this agency?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the agency and remove its data from our servers.
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
            {isEditOpen && (
                <EditAgenciesDialog
                    agency={agency}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={(updatedData) => mutateAgencies()} // Refresh data after edit
                />
            )}
        </>
    );
}