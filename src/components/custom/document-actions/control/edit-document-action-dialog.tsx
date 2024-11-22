'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentAction, documentActionsSchema } from '@/lib/dms/schema';
import { useDocumentActions } from '@/lib/services/document-actions';
import { toast } from 'sonner';

interface EditDocumentActionDialogProps {
    documentAction: DocumentAction | null;
    onClose: () => void;
}

export function EditDocumentActionDialog({
    documentAction,
    onClose,
}: EditDocumentActionDialogProps) {
    const { editDocumentAction } = useDocumentActions();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DocumentAction>({
        resolver: zodResolver(documentActionsSchema),
        defaultValues: documentAction || {},
    });

    const handleFormSubmit = async (data: DocumentAction) => {
        try {
            if (!documentAction?.action_id) {
                throw new Error('Document action ID is missing.');
            }

            // Ensure the correct data structure matches the backend expectations
            const updatePayload = {
                name: data.name,
                description: data.description,
                sender_tag: data.sender_tag,
                recipient_tag: data.recipient_tag,
            };

            // Call the API function to edit the document action
            await editDocumentAction(documentAction.action_id, updatePayload);

            // Show success message
            toast.success('Document action updated successfully!');
            onClose();
        } catch (error: any) {
            // Show error message
            toast.error(error.message || 'Failed to update document action.');
        }
    };

    return (
        <Dialog open={!!documentAction} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Document Action</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Action Name */}
                    <div>
                        <label htmlFor="name" className="block mb-1">Action Name *</label>
                        <Input
                            id="name"
                            placeholder="Enter action name"
                            {...register('name')}
                            className="w-full"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block mb-1">Description *</label>
                        <Input
                            id="description"
                            placeholder="Enter description"
                            {...register('description')}
                            className="w-full"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
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
                        {errors.sender_tag && (
                            <p className="text-red-500 text-sm">{errors.sender_tag.message}</p>
                        )}
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
                        {errors.recipient_tag && (
                            <p className="text-red-500 text-sm">{errors.recipient_tag.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button type="submit" variant="default">Save</Button>
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
