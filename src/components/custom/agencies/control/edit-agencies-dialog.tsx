'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Agency } from '@/lib/types/agency';
import { toast } from 'sonner';
import { useAgencies } from '@/lib/services/agencies';

export function EditAgenciesDialog({
    agency,
    onClose,
    onSubmit,
}: {
    agency: Agency;
    onClose: () => void;
    onSubmit: (data: Agency) => void;
}) {
    const { register, handleSubmit } = useForm<{ name: string; code: string }>({
        defaultValues: {
            name: agency.name,
            code: agency.code,
        },
    });
    const { updateAgency } = useAgencies();

    const handleFormSubmit = async (data: { name: string; code: string }) => {
        try {
            alert(`${data.name},${data.code}`); 
            await updateAgency(agency.agency_id, data); 
            toast.success('Agency updated successfully');
            onSubmit({ ...agency, ...data }); 
        } catch (error: any) {
            toast.error(error.message || 'Failed to update agency');
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Agency</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Enter agency name"
                        />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Code
                        </label>
                        <Input
                            id="code"
                            {...register('code', { required: 'Code is required' })}
                            placeholder="Enter agency code"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="submit" variant="default">
                            Save
                        </Button>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
