'use client'

import RecentDocuments from '@/components/custom/dashboard/recent-documents'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { Icons } from '@/components/ui/icons'
import { Stats, StatusCounts } from '@/lib/types'
import { useDocuments } from '@/lib/services/documents'
import { Overview } from '@/components/custom/dashboard/overview'
import { StatCard } from '@/components/custom/dashboard/stat-card'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { AddDocumentButton } from '@/components/custom/common/add-document/add-document-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { JoinedDocument } from '@/lib/dms/joined-docs'

// Define status mapping
const statusMapping = {
    // Document Status (doc_status) mappings
    'dispatch': 'dispatch',
    'intransit': 'outgoing',
    'completed': 'completed',

    // Transit Status (intransit_status) mappings
    'incoming': 'incoming',
    'outgoing': 'outgoing',
    'process': 'recieved',
} as const

type DashboardStatus = 'incoming' | 'recieved' | 'outgoing' | 'dispatch' | 'completed'
type DocStatus = 'intransit' | 'recieved' | 'dispatch' | 'completed'

// Helper function to determine document status
const getDashboardStatus = (doc: JoinedDocument): DashboardStatus => {
    const docStatus = doc.status.toLowerCase() as keyof typeof statusMapping
    
    if(docStatus == 'dispatch' && doc.is_received){
        return 'recieved';
    }

    if(docStatus == 'completed'){
        return 'completed';
    }

    return 'dispatch'

    // Fall back to document status
    // return statusMapping[docStatus] as DashboardStatus || 'dispatch'
}

export default function Page() {
    const { data: session } = useSession()
    const { documents: docs = [] } = useDocuments()

    const stats = useMemo<Stats>(() => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const createEmptyCounts = (): StatusCounts => ({
            dispatch: 0,
            incoming: 0,
            recieved: 0,
            outgoing: 0,
            completed: 0,
        })

        const currentCounts = createEmptyCounts()
        const lastMonthCounts = createEmptyCounts()
        docs.forEach((doc: JoinedDocument) => {
            const docDate = new Date(doc.date_created)
            const docMonth = docDate.getMonth()
            const docYear = docDate.getFullYear()

            const counts =
                docMonth === currentMonth && docYear === currentYear
                    ? currentCounts
                    : docMonth === (currentMonth - 1 + 12) % 12 &&
                        (docMonth === 11 ? docYear === currentYear - 1 : docYear === currentYear)
                        ? lastMonthCounts
                        : null

            if (counts) {
                if(doc.status == 'intransit'){
                    if(doc.from_agency == doc.to_agency && doc.to_agency){
                        counts['incoming']++
                        counts['outgoing']++
                    }else{
                        if(doc.from_agency == doc.receiving_office){
                            counts['outgoing']++;
                        }else{
                            counts['incoming']++;
                        }
                    }
                }else{
                    const status = getDashboardStatus(doc)
                    counts[status]++
                }
            }
        })

        const getPercentageChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Number(((current - previous) / previous * 100).toFixed(1))
        }

        return {
            current: currentCounts,
            percentageChanges: {
                dispatch: getPercentageChange(currentCounts.dispatch, lastMonthCounts.dispatch),
                incoming: getPercentageChange(currentCounts.incoming, lastMonthCounts.incoming),
                recieved: getPercentageChange(currentCounts.recieved, lastMonthCounts.recieved),
                outgoing: getPercentageChange(currentCounts.outgoing, lastMonthCounts.outgoing),
                completed: getPercentageChange(currentCounts.completed, lastMonthCounts.completed),
            },
        }
    }, [docs])

    const chartData = useMemo(() => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        const today = new Date()
        const currentDate = new Date(today)
        currentDate.setDate(currentDate.getDate() - 4)

        const weeklyData = daysOfWeek.map(() => {
            const dateStr = currentDate.toISOString().split('T')[0]
            const dayDocs = docs.filter(
                (doc: JoinedDocument) => doc.date_created && doc.date_created.split('T')[0] === dateStr
            )

            const dayData = {
                dispatch: dayDocs.filter(doc => getDashboardStatus(doc) === 'dispatch').length,
                incoming: dayDocs.filter(doc => getDashboardStatus(doc) === 'incoming').length,
                recieved: dayDocs.filter(doc => getDashboardStatus(doc) === 'recieved').length,
                outgoing: dayDocs.filter(doc => getDashboardStatus(doc) === 'outgoing').length,
                completed: dayDocs.filter(doc => getDashboardStatus(doc) === 'completed').length,
            }

            currentDate.setDate(currentDate.getDate() + 1)
            return dayData
        })

        return {
            dispatch: weeklyData.map((day) => ({ value: day.dispatch })),
            incoming: weeklyData.map((day) => ({ value: day.incoming })),
            recieved: weeklyData.map((day) => ({ value: day.recieved })),
            outgoing: weeklyData.map((day) => ({ value: day.outgoing })),
            completed: weeklyData.map((day) => ({ value: day.completed })),
        }
    }, [docs])


    const recentDocs = useMemo(() => {
        return [...docs]
            .sort((a: JoinedDocument, b: JoinedDocument) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
            .slice(0, 5)
    }, [docs])

    return (
        <>
            <DashboardHeader userName={session?.user?.first_name} />
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <div className='hidden flex-col md:flex'>
                    <div className='flex-1 space-y-4'>
                        <div className='flex items-center justify-between space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tight ml-5'>Overview</h2>
                            <div className='flex items-center space-x-2'>
                                <AddDocumentButton title='Receive a Document' actionType='Receive' variant='destructive' />
                                <AddDocumentButton title='Transmit a Document' actionType='Release' variant='destructive' />
                                <AddDocumentButton title='Enroll a Document' actionType='Create' variant='default' />
                            </div>
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
                            <StatCard
                                title='Owned'
                                icon={Icons.dispatch}
                                count={stats.current.dispatch}
                                change={stats.percentageChanges.dispatch}
                                data={chartData.dispatch}
                                variant="dispatch"
                            />
                            <StatCard
                                title='Incoming'
                                icon={Icons.incoming}
                                count={stats.current.incoming}
                                change={stats.percentageChanges.incoming}
                                data={chartData.incoming}
                                variant="incoming"
                            />
                            <StatCard
                                title='Received'
                                icon={Icons.received}
                                count={stats.current.recieved}
                                change={stats.percentageChanges.recieved}
                                data={chartData.recieved}
                                variant="received"
                            />
                            <StatCard
                                title='Outgoing'
                                icon={Icons.outgoing}
                                count={stats.current.outgoing}
                                change={stats.percentageChanges.outgoing}
                                data={chartData.outgoing}
                                variant="outgoing"
                            />
                            <StatCard
                                title='Completed'
                                icon={Icons.completed}
                                count={stats.current.completed}
                                change={stats.percentageChanges.completed}
                                data={chartData.completed}
                                variant="completed"
                            />
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                            <Card className='col-span-4'>
                                <CardContent className='pl-2'>
                                    <Overview documents={docs} />
                                </CardContent>
                            </Card>
                            <Card className='col-span-3'>
                                <CardHeader>
                                    <CardTitle>Recent Documents</CardTitle>
                                    <CardDescription>
                                        You have {docs.length} total documents.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentDocuments documents={recentDocs} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}