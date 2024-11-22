'use client'

import { DashboardHeader } from '@/components/custom/dashboard/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOutgoingDocuments, useIncomingDocuments } from '@/lib/services/documents'
import { columns as incomingColumns } from '@/components/custom/incoming-documents/columns'
import { columns as outgoingColumns } from '@/components/custom/outgoing-documents/columns'
import { DataTable as OutgoingDataTable } from '@/components/custom/outgoing-documents/data-table'
import { DataTable as IncomingDataTable } from '@/components/custom/incoming-documents/data-table'
import { useEffect } from 'react'

export default function DocumentsPage() {
    const { documents: incomingDocuments, isLoading: incomingLoading, mutate: mutateIncoming } = useIncomingDocuments()
    const { documents: outgoingDocuments, isLoading: outgoingLoading, mutate: mutateOutgoing } = useOutgoingDocuments()


    useEffect(()=>{
        mutateIncoming();
        mutateOutgoing();
    },[mutateIncoming,mutateOutgoing])

    // if ( incomingLoading || outgoingLoading ) {
    //     return <div>Loading...</div>
    // }

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