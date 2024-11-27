'use client'

import { toast } from 'sonner'
import { formatTime } from '@/lib/controls'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgeVariant, Notification, NotificationPriority } from '@/lib/types/notifications'
import { useNotifications } from '@/lib/services/notifications'
import TableSkeleton from '@/components/custom/common/table-skeleton'
import { useWebSocket } from '@/lib/services/global'
import { useEffect } from 'react'


const NotificationItem = ({ notification }: { notification: Notification }) => {
    const getPriorityBadgeVariant = (priority: NotificationPriority): BadgeVariant => {
        switch (priority) {
            case 'high':
                return 'destructive'
            case 'medium':
                return 'secondary'
            case 'low':
                return 'default'
        }
    }

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'document':
                return <Icons.fileText className='h-4 w-4' />
            case 'reminder':
                return <Icons.calendarClock className='h-4 w-4' />
            case 'action':
                return <Icons.bell className='h-4 w-4' />
            default:
                return <Icons.bell className='h-4 w-4' />
        }
    }

    return (
        <div
            className={`p-4 border-b last:border-b-0 transition hover:bg-muted hover:shadow-sm hover:scale-[1.01] ${notification.status === 'unread' ? 'bg-muted/50' : ''
                }`}
        >
            <div className='flex items-start gap-4'>
                <div className='p-2 rounded-full bg-muted'>
                    {getNotificationIcon()}
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between gap-2 mb-1'>
                        <p className='text-sm font-medium truncate'>{notification.title}</p>
                        <span className='text-xs text-muted-foreground whitespace-nowrap'>
                            {new Date(notification.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                            })}
                        </span>
                    </div>
                    <p className='text-sm text-muted-foreground mb-2'>{notification.message}</p>
                    <div className='flex items-center gap-2'>
                        <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                            {notification.priority}
                        </Badge>
                        <Badge variant={notification.status === 'unread' ? 'default' : 'secondary'}>
                            {notification.status}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

function NotificationList({ notifications }: { notifications: Notification[] }) {
    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className='pr-4'>
                    <div className='space-y-1'>
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default function NotificationsPage() {
    const {notifications, isLoading, mutate,error} = useNotifications();
    const {message} = useWebSocket(['transits','documents','feedbacks']);

    const filterNotifications = (tab: string) => {
        if (tab === 'all') return notifications
        if (tab === 'unread') return notifications.filter(n => n.status === 'unread')
        return notifications.filter(n => n.type === tab)
    }

    const readAll = () => {
        toast.success('All notifications are read.')
    }


    useEffect(()=>{
        mutate();
    },[message])
    
    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents' },
                        { label: 'Recieved', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <TableSkeleton columns={6} rows={8} />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <p className='text-red-500'>Error loading documents. Please try again later.</p>
                </div>
            </>
        )
    }
    
    




    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard', active: false },
                    { label: 'Notifications', href: '/dashboard/notifications', active: true },
                ]}
            />
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <Tabs defaultValue='all' className='w-full'>
                    <div className='flex items-center justify-between space-x-4 pb-3'>
                        <TabsList className='bg-muted'>
                            <TabsTrigger value='all'>All</TabsTrigger>
                            {/* <TabsTrigger value='unread'>Unread</TabsTrigger> */}
                            <TabsTrigger value='document'>Documents</TabsTrigger>
                            <TabsTrigger value='system'>User Feedbacks</TabsTrigger>
                            {/* <TabsTrigger value='reminder'>Reminders</TabsTrigger> */}
                        </TabsList>
                        {/* <Button onClick={readAll} variant='outline' size='sm'>
                            <Icons.check className='mr-2 h-4 w-4' />
                            Mark all as read
                        </Button> */}
                    </div>

                    <TabsContent value='all'>
                        <NotificationList notifications={filterNotifications('all')} />
                    </TabsContent>
                    {/* <TabsContent value='unread'>
                        <NotificationList notifications={filterNotifications('unread')} />
                    </TabsContent> */}
                    <TabsContent value='document'>
                        <NotificationList notifications={filterNotifications('document')} />
                    </TabsContent>
                    <TabsContent value='system'>
                        <NotificationList notifications={filterNotifications('system')} />
                    </TabsContent>
                    {/* <TabsContent value='reminder'>
                        <NotificationList notifications={filterNotifications('reminder')} />
                    </TabsContent> */}
                </Tabs>
            </div>
        </>
    )
}