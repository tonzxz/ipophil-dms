// src/components/custom/users/control/edit-user-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserForm } from './form/user-form'
import { useUsers } from '@/lib/services/users'
import { User } from '@/lib/dms/schema'
import { UpdateUserData } from '@/lib/validations/user/create'
import { toast } from 'sonner'

interface EditUserDialogProps {
    user: User
    onCloseAction: () => void
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, onCloseAction }) => {
    const { updateUser } = useUsers()

    const handleSubmit = async (data: UpdateUserData) => {
        try {
            await updateUser(user.user_id, data)
            toast.success('User Updated', {
                description: 'User has been successfully updated.',
            })
            onCloseAction()
        } catch (error) {
            toast.error('Failed to update user', {
                description: error instanceof Error ? error.message : 'An error occurred'
            })
        }
    }

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className="w-full max-w-3xl rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <UserForm
                    user={user}
                    mode="edit"
                    onSubmit={handleSubmit}
                    onCloseAction={onCloseAction}
                />
            </DialogContent>
        </Dialog>
    )
}