'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { user_status } from '@/lib/dms/data'
import { userSchema } from '@/lib/dms/schema'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/lib/services/users'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { EditUserDialog } from './control/edit-user-dialog'
import { ViewUserDialog } from './control/view-user-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    onUserDeleted?: () => void
    onStatusChanged?: () => void
}

export function DataTableRowActions<TData>({
    row,
    onUserDeleted,
    onStatusChanged,
}: DataTableRowActionsProps<TData>) {
    const user = userSchema.parse(row.original)
    const { deactivateUser, reactivateUser, deleteUser } = useUsers()

    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Function to copy user ID
    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(user.user_id)
        toast.success('User ID copied to clipboard')
    }

    // Function to view document
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsViewDialogOpen(true)
    }

    // Function to edit user
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsEditDialogOpen(true)
    }

    // Function to delete user
    const handleDelete = async () => {
        try {
            setIsLoading(true)
            await deleteUser(user.user_id)
            toast.success('User deleted successfully')
            onUserDeleted?.()
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user')
        } finally {
            setIsLoading(false)
        }
    }

    // commented for now: 'Function to change user status'
    const handleStatusChange = async (e: React.MouseEvent, newStatus: string) => {
        e.stopPropagation()
        try {
            setIsLoading(true)
            if (newStatus === 'inactive') {
                await deactivateUser(user.user_id)
            } else if (newStatus === 'active') {
                await reactivateUser(user.user_id)
            }
            toast.success(`Status updated to ${newStatus}`)
            onStatusChanged?.()
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update user status')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isLoading}
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={handleCopyId}>
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleView}>
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleEdit}>
                        Edit User
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                            onClick={(e) => e.stopPropagation()}
                            disabled={isLoading}
                        >
                            Change Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuRadioGroup value={user.active ? 'active' : 'inactive'}>
                                {user_status.map((status) => (
                                    <DropdownMenuRadioItem
                                        key={status.value}
                                        value={status.value}
                                        onClick={(e) => handleStatusChange(e, status.value)}
                                        disabled={isLoading}
                                    >
                                        {status.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isLoading}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete
                                {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user and remove their data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </DropdownMenuContent>
            </DropdownMenu>

            {/* View User Dialog */}
            {isViewDialogOpen && (
                <ViewUserDialog
                    user={user}
                    onCloseAction={() => setIsViewDialogOpen(false)}
                />
            )}

            {/* Edit User Dialog */}
            {isEditDialogOpen && (
                <EditUserDialog
                    user={user}
                    onCloseAction={() => setIsEditDialogOpen(false)}
                />
            )}
        </>
    )
}