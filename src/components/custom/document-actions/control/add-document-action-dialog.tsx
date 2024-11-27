'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentActions } from '@/lib/services/document-actions';

// Schema
const createDocumentActionSchema = z.object({
    name: z.string().min(1, 'Action name is required').max(50),
    description: z.string().min(1, 'Description is required').max(255),
    sender_tag: z.string().min(1, 'Sender tag is required').max(50),
    recipient_tag: z.string().min(1, 'Recipient tag is required').max(50),
});

type CreateDocumentActionData = z.infer<typeof createDocumentActionSchema>;

interface AddDocumentActionDialogProps {
    onCloseAction: () => void;
}

export const AddDocumentActionDialog: React.FC<AddDocumentActionDialogProps> = ({ onCloseAction }) => {
    const { createDocumentAction } = useDocumentActions();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateDocumentActionData>({
        resolver: zodResolver(createDocumentActionSchema),
    });

    const handleCreateSubmit = async (data: CreateDocumentActionData) => {
        try {
            console.log(data);
            await createDocumentAction(data);

            // Show success toast
            toast.success('Document Action Created', {
                description: 'Your document action has been successfully created.',
            });

            // Close the dialog
            onCloseAction();
        } catch (error: any) {
            // Display error message from API
            toast.error(error.message || 'Failed to create document action.');
        }
    };

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Document Action</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateSubmit)} className="grid grid-cols-2 gap-4">
                    {/* Action Name */}
                    <div className="col-span-2">
                        <label htmlFor="name" className="block mb-1">Action Name *</label>
                        <Input
                            id="name"
                            placeholder="Enter action name"
                            {...register('name')}
                            className="w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <label htmlFor="description" className="block mb-1">Description *</label>
                        <Input
                            id="description"
                            placeholder="Enter description"
                            {...register('description')}
                            className="w-full"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Sender Tag */}
                    <div>
                        <label htmlFor="sender_tag" className="block mb-1">Sender Tag *</label>
                        <Input
                            id="sender_tag"
                            placeholder="Enter sender tag"
                            {...register('sender_tag')}
                            className="w-full"
                        />
                        {errors.sender_tag && <p className="text-red-500 text-sm">{errors.sender_tag.message}</p>}
                    </div>

                    {/* Recipient Tag */}
                    <div>
                        <label htmlFor="recipient_tag" className="block mb-1">Recipient Tag *</label>
                        <Input
                            id="recipient_tag"
                            placeholder="Enter recipient tag"
                            {...register('recipient_tag')}
                            className="w-full"
                        />
                        {errors.recipient_tag && <p className="text-red-500 text-sm">{errors.recipient_tag.message}</p>}
                    </div>

                    {/* Information Card */}
                    <Card className="col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <p className="text-sm text-gray-500">The following fields are auto-generated:</p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-500 list-disc list-inside">
                                <li>Action ID</li>
                                <li>Created At</li>
                                <li>Updated At</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="col-span-2 flex justify-end space-x-2">
                        <Button type="submit" variant="default">Create</Button>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={onCloseAction}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
