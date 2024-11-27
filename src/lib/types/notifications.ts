import { Icons } from "@/components/ui/icons"

export type NotificationType = 'document' | 'system' | 'reminder' | 'action'
export type NotificationStatus = 'read' | 'unread'
export type NotificationPriority = 'high' | 'medium' | 'low'
export type BadgeVariant = 'destructive' | 'secondary' | 'default' | 'outline'
export type AvailableIcons = keyof typeof Icons

export interface Notification {
    id: number
    type: NotificationType
    title: string
    message: string
    timestamp: string
    status: NotificationStatus
    priority: NotificationPriority
    icon: AvailableIcons
}