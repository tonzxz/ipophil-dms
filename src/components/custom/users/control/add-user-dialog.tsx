// src/components/custom/users/control/add-user-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserForm } from './form/user-form'
import { useUsers } from '@/lib/services/users'
import { CreateUserData } from '@/lib/validations/user/create'
import { toast } from 'sonner'

interface AddUserDialogProps {
    onCloseAction: () => void
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ onCloseAction }) => {
    const { createUser } = useUsers()

    const handleSubmit = async (data: CreateUserData) => {
        try {
            await createUser(data)
            toast.success('User Created', {
                description: 'New user has been successfully added.',
            })
            onCloseAction()
        } catch (error) {
            toast.error('Failed to create user', {
                description: error instanceof Error ? error.message : 'An error occurred'
            })
        }
    }

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent
                className="w-full max-w-[90%] md:max-w-3xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <UserForm
                        mode="create"
                        onSubmit={handleSubmit}
                        onCloseAction={onCloseAction}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
