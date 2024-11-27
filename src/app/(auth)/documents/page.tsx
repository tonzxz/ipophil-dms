'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useDocuments } from '@/lib/services/documents'
import { columns } from '@/components/custom/documents/columns'
import { DataTable } from '@/components/custom/documents/data-table'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { useWebSocket } from '@/lib/services/global'
import { useEffect } from 'react'
import TableSkeleton from '@/components/custom/common/table-skeleton'
import { useCount } from '@/lib/context/count-context'

export default function DocumentsPage() {
    const { documents, error, isLoading, mutate } = useDocuments()
    const {message} = useWebSocket(['transits']);
    const {notify} = useCount();
    useEffect(()=>{
        notify('total');
    },[])
    useEffect(()=>{
        mutate()
    },[message])

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <TableSkeleton columns={6} rows={8} />
                </div>
            </>
        )
    }

    if (error) {
        console.log(error)
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
                    { label: 'Documents', href: '/documents', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <DataTable
                    data={documents || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    )
}