import { useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { AddDocumentDialog } from '@/components/custom/common/add-document/add-document-dialog';

interface AddDocumentButtonProps {
    title?: string;
    onAdd?: () => void;
    actionType: 'Create' | 'Edit' | 'Release' | 'Receive';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    className?: string;
    initialData?: any; // Pass data for editing, optional
}

export const AddDocumentButton: React.FC<AddDocumentButtonProps> = ({
    title = 'Add',
    onAdd,
    actionType,
    variant = 'default',
    className = 'h-10 px-2 lg:px-3 relative group transition-all duration-300',
    initialData,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        if (onAdd) onAdd();
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => setIsDialogOpen(false);

    const getIcon = () => {
        switch (actionType) {
            case 'Create':
                return <Icons.add className="h-4 w-4" />;
            case 'Edit':
                return <Icons.edit className="h-4 w-4" />;
            case 'Release':
                return <Icons.lucideSend className="h-4 w-4" />;
            default:
                return <Icons.add className="h-4 w-4" />;
        }
    };

    return (
        <>
            <Button
                variant={variant}
                onClick={handleOpenDialog}
                className={`${className} group hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:border-transparent hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
                <span className="flex items-center transition-transform duration-300 group-hover:scale-105">
                    {getIcon()}
                    <span className="ml-2">{title}</span>
                </span>
            </Button>
            {isDialogOpen && (
                <AddDocumentDialog
                    onCloseAction={handleCloseDialog}
                    actionType={actionType}
                    initialData={initialData}
                />
            )}
        </>
    );
};
