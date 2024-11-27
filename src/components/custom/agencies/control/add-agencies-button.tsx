'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddAgenciesDialog } from './add-agencies-dialog';
import { toast } from 'sonner';
import { useAgencies } from '@/lib/services/agencies';

interface AddAgenciesButtonProps {
    onAdd?: () => void; // Optional callback to trigger parent re-fetch or revalidation
}

export function AddAgenciesButton({ onAdd }: AddAgenciesButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { createAgency } = useAgencies(); // Use the createAgency function from the hook

    const handleAddAgency = async (data: { name: string; code: string }) => {
        try {
            await createAgency(data); // Call createAgency from the hook
            toast.success('Agency added successfully');
            setIsOpen(false);

            // Trigger parent re-fetch or revalidation if provided
            if (onAdd) onAdd();
        } catch (error: any) {
            console.error('Failed to create agency:', error);
            toast.error(error.message || 'Failed to add agency');
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="default">
                Add Agency
            </Button>
            {isOpen && (
                <AddAgenciesDialog
                    onClose={() => setIsOpen(false)}
                    onSubmit={handleAddAgency} // Pass the handler to handle form submission
                />
            )}
        </>
    );
}
