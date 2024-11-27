import { cn } from '@/lib/utils'
import { ComponentType } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SparklineChart } from '@/components/custom/dashboard/sparkline-chart'

interface StatCardProps {
    title: string
    icon: ComponentType<{ className?: string }>
    count: number
    change: number
    data: Array<{ value: number }>
    variant?: 'default' | 'dispatch' | 'incoming' | 'received' | 'outgoing' | 'completed'
}

const variantStyles = {
    default: 'border-l-2 border-gray-200',
    dispatch: 'border-l-2 border-blue-400',
    incoming: 'border-l-2 border-green-400',
    received: 'border-l-2 border-purple-400',
    outgoing: 'border-l-2 border-amber-400',
    completed: 'border-l-2 border-emerald-400'
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    icon: Icon,
    count,
    change,
    data,
    variant = 'default'
}) => (
    <Card className={cn('relative hover:shadow-md transition-shadow', variantStyles[variant])}>
        <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-semibold">{count}</span>
                <span className={cn(
                    'text-xs font-medium',
                    change > 0 ? 'text-emerald-500' : change < 0 ? 'text-red-500' : 'text-gray-500'
                )}>
                    {change > 0 ? '↑' : change < 0 ? '↓' : ''}
                    {Math.abs(change)}%
                </span>
            </div>
            <div className="h-8">
                <SparklineChart data={data} />
            </div>
        </CardContent>
    </Card>
)