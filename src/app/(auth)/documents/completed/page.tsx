'use client'

import { useCompletedDocuments, useDocuments } from '@/lib/services/documents'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { columns } from '@/components/custom/completed-documents/columns'
import { DataTable } from '@/components/custom/completed-documents/data-table'
import { useEffect, useState } from 'react'
import { useWebSocket } from '@/lib/services/global'
import TableSkeleton from '@/components/custom/common/table-skeleton'
import { useCount } from '@/lib/context/count-context'

export default function DocumentsPage() {
    const { documents, error, isLoading, mutate } = useCompletedDocuments()
    const { mutate: mutateAll} = useDocuments();
    const {notify} = useCount();
    const {message} = useWebSocket(['transits']);

    useEffect(()=>{
        notify('completed');
    },[])

    useEffect(()=>{
       
        mutate();
        mutateAll();
    },[message])
        
    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Documents', href: '/documents' },
                        { label: 'Completed', active: true },
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
                        { label: 'Documents', href: '/documents' },
                        { label: 'Completed', active: true },
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
                    { label: 'Documents', href: '/documents' },
                    { label: 'Completed', active: true },
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