'use client'

import React, { useState, useEffect } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeChange } from '../theme/theme-change'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { UserHeaderNav } from './user-header-nav'

interface DashboardHeaderProps {
    userName?: string
    breadcrumbs?: {
        href?: string
        label: string
        active?: boolean
    }[]
}

export function DashboardHeader({ userName = '', breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [date, setDate] = useState<Date>(new Date())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(date)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    const getGreeting = () => {
        const hour = currentTime?.getHours() || 0
        if (hour < 12) return 'Good morning,'
        if (hour < 17) return 'Good afternoon,'
        return 'Good evening,'
    }

    return (
        <header className='flex h-16 shrink-0 items-center px-4 justify-between mr-4 ml-4 mt-4 mb-2 rounded-lg shadow-sm border bg-popover'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1' />
                {userName ? (
                    <div className='flex items-center gap-2'>
                        <span className='text-muted-foreground'>
                            {getGreeting()}
                        </span>
                        <span className='font-semibold'>
                            {userName}! ✨
                        </span>
                    </div>
                ) : breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={index}>
                                        {index < breadcrumbs.length - 1 ? (
                                            <>
                                                <BreadcrumbItem className='hidden md:block'>
                                                    <BreadcrumbLink href={breadcrumb.href || '#'}>
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className='hidden md:block' />
                                            </>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </>
                ) : null}
            </div>

            <div className='ml-auto flex items-center gap-4'>
                {/* {currentTime && (
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 h-9 px-4 py-2 bg-card"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                <span>{formatDate(currentTime)}</span>
                                <span className="tabular-nums border-l pl-2 ml-2">
                                    {formatTime(currentTime)}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={() => {
                                    // Note: This prevent selection by leaving this empty or setting back the current date
                                    setDate(date);
                                }}
                                initialFocus
                                className="pointer-events-none select-none opacity-75"
                            />
                        </PopoverContent>
                    </Popover>
                )} */}
                {currentTime && (
                    <div>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 h-9 px-4 py-2 bg-card"
                        >
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(currentTime)}</span>
                            <span className="tabular-nums border-l pl-2 ml-2">
                                {formatTime(currentTime)}
                            </span>
                        </Button>
                    </div>
                )}
                <ThemeChange />
                <UserHeaderNav />
            </div>
        </header>
    )
}