import { toast } from 'sonner';
import { useDocuments } from '@/lib/services/documents';
import { ScanDocumentForm } from './scan-document-form';
import { CreateDocumentForm } from './create-document-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddDocumentDialogProps {
    onCloseAction: () => void;
    actionType: 'Create' | 'Edit' | 'Release' | 'Receive';
    initialData?: any; // Data for editing, optional
}

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
    onCloseAction,
    actionType,
    initialData,
}) => {
    const { createDocument, updateDocument } = useDocuments();

    const handleCreateSubmit = async (data: any) => {
        try {
            if (actionType === 'Edit') {
                await updateDocument(initialData.id, data);
                toast.success('Document updated successfully.', {
                    description: 'Your document has been successfully updated.',
                });
            } else {
                await createDocument(data);
                toast.success('Document created successfully.', {
                    description: 'Your document has been successfully added.',
                });
            }
            onCloseAction();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${actionType.toLowerCase()} document.`);
        }
    };

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className="w-full max-w-4xl rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>{actionType} Document</DialogTitle>
                </DialogHeader>

                {actionType === 'Create' || actionType === 'Edit' ? (
                    <CreateDocumentForm
                        actionType = {actionType}
                        onSubmit={handleCreateSubmit}
                        onClose={onCloseAction}
                        initialData={initialData}
                    />
                ) : (
                    <ScanDocumentForm
                        onSubmit={(data) => console.log('Scan form submitted:', data)}
                        onClose={onCloseAction}
                        actionType={actionType}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
