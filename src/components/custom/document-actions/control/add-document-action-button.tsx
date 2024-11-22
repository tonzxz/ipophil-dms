import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddDocumentActionDialog } from '@/components/custom/document-actions/control/add-document-action-dialog';
import { Icons } from '@/components/ui/icons';

interface AddDocumentActionButtonProps {
    title?: string;
    onAdd?: () => void;
    className?: string;
}

export const AddDocumentActionButton: React.FC<AddDocumentActionButtonProps> = ({
    title = 'Add Document Action',
    onAdd,
    className = 'h-8 px-2 lg:px-3',
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        if (onAdd) onAdd();
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <>
            <Button onClick={handleOpenDialog} className={className}>
                <Icons.add className="h-4 w-4" />
                {title}
            </Button>
            {isDialogOpen && (
                <AddDocumentActionDialog onCloseAction={handleCloseDialog} />
            )}
        </>
    );
};
