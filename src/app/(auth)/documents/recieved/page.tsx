'use client'

import { useDocuments, useReceivedDocuments } from '@/lib/services/documents'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { columns } from '@/components/custom/recieved-documents/columns'
import { DataTable } from '@/components/custom/recieved-documents/data-table'
import {  useWebSocket } from '@/lib/services/global'
import { useEffect, useState } from 'react'
import TableSkeleton from '@/components/custom/common/table-skeleton'
import { useCount } from '@/lib/context/count-context'

export default function DocumentsPage() {
    const { documents, error, isLoading,mutate } = useReceivedDocuments()
    const { mutate: mutateAll} = useDocuments();
    const {message}= useWebSocket(['transits']);
    const {notify} = useCount();

    useEffect(()=>{
        notify('received');
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