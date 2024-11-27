'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddAgenciesDialogProps {
    onClose: () => void;
    onSubmit: (data: { name: string; code: string }) => Promise<void>; // Updated type to accept (data)
}

interface FormData {
    name: string;
    code: string;
}

export function AddAgenciesDialog({ onClose, onSubmit }: AddAgenciesDialogProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const handleFormSubmit = async (data: FormData) => {
        try {
            await onSubmit(data); // Ensure the parent handler is awaited
        } catch (error) {
            toast.error('Failed to add agency.'); // Handle any additional errors here
        }
        onClose(); // Close the dialog
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Agency</DialogTitle>
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
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
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
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="submit" variant="default">
                            Add
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
