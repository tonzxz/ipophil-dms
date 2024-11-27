'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentActions } from '@/lib/services/document-actions'
import { columns } from '@/components/custom/document-actions/columns'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { DataTable } from '@/components/custom/document-actions/data-table'

export default function DocumentActionsPage() {
    const { documentActions, error, isLoading } = useDocumentActions()

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Document Actions', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <Skeleton className='h-[500px] w-full' />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Document Actions', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <p className='text-red-500'>Error loading document actions. Please try again later.</p>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Document Actions', active: true },
                ]}
            />

            <div className='flex flex-1 flex-col gap-4 p-4'>
                <DataTable
                    data={documentActions || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    )
}
