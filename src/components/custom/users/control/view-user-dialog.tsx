import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAgencies } from '@/lib/services/agencies'
import { User } from '@/lib/dms/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ViewUserDialogProps {
    user: User
    onCloseAction: () => void
}

export const ViewUserDialog: React.FC<ViewUserDialogProps> = ({ user, onCloseAction }) => {
    const { agencies, isLoading, error } = useAgencies()

    const agency = agencies?.find(a => a.agency_id === user.agency_id)

    // Ensure avatar URL is a string or undefined
    const avatarUrl = user.avatar || undefined;

    if (isLoading) {
        return (
            <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
                <DialogContent className='w-full max-w-3xl rounded-lg shadow-lg'>
                    <DialogHeader>
                        <DialogTitle>Loading...</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    }

    if (error) {
        return (
            <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
                <DialogContent className='w-full max-w-3xl rounded-lg shadow-lg'>
                    <DialogHeader>
                        <DialogTitle>Error</DialogTitle>
                    </DialogHeader>
                    <p className='text-red-500'>{error.message}</p>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className='w-full max-w-3xl rounded-lg shadow-lg'>
                <DialogHeader>
                    <DialogTitle>View User</DialogTitle>
                </DialogHeader>

                <div className='flex flex-col space-y-6'>

                    <div className='flex items-center space-x-6'>
                        <Avatar className='w-24 h-24'>
                            <AvatarImage src={avatarUrl} alt={`${user.first_name} ${user.last_name}`} />
                            <AvatarFallback>
                                {user.first_name[0]}{user.last_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className='text-3xl font-semibold'>{user.first_name} {user.last_name}</h2>
                            <p className='text-gray-500 text-lg'>{user.title}</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        {/* First Name */}
                        <div>
                            <Label className='text-gray-500'>First Name</Label>
                            <p className='text-base'>{user.first_name}</p>
                        </div>

                        {/* Last Name */}
                        <div>
                            <Label className='text-gray-500'>Last Name</Label>
                            <p className='text-base'>{user.last_name}</p>
                        </div>

                        {/* Middle Name */}
                        <div>
                            <Label className='text-gray-500'>Middle Name</Label>
                            <p className='text-base'>{user.middle_name || 'N/A'}</p>
                        </div>

                        {/* Email */}
                        <div>
                            <Label className='text-gray-500'>Email</Label>
                            <p className='text-base'>{user.email}</p>
                        </div>

                        {/* Agency */}
                        <div>
                            <Label className='text-gray-500'>Bureau/Office/Unit</Label>
                            <p className='text-base'>{agency ? agency.name : 'Loading...'}</p>
                        </div>

                        {/* Job Type */}
                        <div>
                            <Label className='text-gray-500'>Job Type</Label>
                            <p className='text-base'>{user.type}</p>
                        </div>

                        {/* Role */}
                        <div>
                            <Label className='text-gray-500'>Role</Label>
                            <p className='text-base'>{user.role}</p>
                        </div>

                        {/* Job Title */}
                        <div>
                            <Label className='text-gray-500'>Job Title</Label>
                            <p className='text-base'>{user.title}</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-base font-medium text-gray-500'>
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-500 list-disc list-inside">
                                <li>User ID: {user.user_id}</li>
                                <li>Username: {user.user_name}</li>
                                <li>Created At: {new Date(user.created_at).toLocaleString()}</li>
                                <li>Updated At: {new Date(user.updated_at).toLocaleString()}</li>
                                <li>User Status: {user.active ? 'Active' : 'Inactive'}</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <div className='flex justify-end space-x-2'>
                        <Button variant='secondary' onClick={onCloseAction}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}