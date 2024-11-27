// src\app\(auth)\documents\intransit\page.tsx
'use client'

import { DashboardHeader } from '@/components/custom/dashboard/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOutgoingDocuments, useIncomingDocuments, useDocuments } from '@/lib/services/documents'
import { columns as incomingColumns } from '@/components/custom/incoming-documents/columns'
import { columns as outgoingColumns } from '@/components/custom/outgoing-documents/columns'
import { DataTable as OutgoingDataTable } from '@/components/custom/outgoing-documents/data-table'
import { DataTable as IncomingDataTable } from '@/components/custom/incoming-documents/data-table'
import { useEffect, useState } from 'react'
import {  useWebSocket } from '@/lib/services/global'
import TableSkeleton from '@/components/custom/common/table-skeleton'
import { useCount } from '@/lib/context/count-context'

export default function DocumentsPage() {
    const { documents: incomingDocuments, isLoading: incomingLoading, error:incomingError , mutate: mutateIncoming } = useIncomingDocuments()
    const { documents: outgoingDocuments, isLoading: outgoingLoading, error:outgoingError ,mutate: mutateOutgoing } = useOutgoingDocuments()
    const { mutate: mutateAll} = useDocuments();
    const {notify} = useCount();
    const {message}= useWebSocket(['transits']);


    useEffect(()=>{
        notify('intransit');
    },[])



    useEffect(()=>{
        mutateIncoming();
        mutateOutgoing();
        mutateAll();
    },[message])


    if (incomingLoading||outgoingLoading) {
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
    
    if (incomingError|| outgoingError) {
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
                    { label: 'Documents', href: '/documents' },
                    { label: 'In Transit', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <Tabs defaultValue='incoming' className='flex-1 flex flex-col'>
                    <TabsList className='grid grid-cols-2 w-max'>
                        <TabsTrigger value='incoming'>Incoming Documents</TabsTrigger>
                        <TabsTrigger value='outgoing'>Outgoing Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value='incoming' className='mt-4'>
                        <IncomingDataTable
                            data={incomingDocuments || []}
                            columns={incomingColumns}
                            selection={false}
                        />
                    </TabsContent>
                    <TabsContent value='outgoing' className='mt-4'>
                        <OutgoingDataTable
                            data={outgoingDocuments || []}
                            columns={outgoingColumns}
                            selection={false}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}