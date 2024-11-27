'use client'

import { useUsers } from '@/lib/services/users'
import { columns } from '@/components/custom/users/columns'
import { DashboardHeader } from '@/components/custom/dashboard/header'
import { DataTable } from '@/components/custom/users/data-table'
import TableSkeleton from '@/components/custom/common/table-skeleton'

export default function UserPage() {
    const { users, error, isLoading } = useUsers()

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[
                        { label: 'Users', active: true },
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
                        { label: 'Users', active: true },
                    ]}
                />
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <p className='text-red-500'>Error loading users. Please try again later.</p>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Users', active: true },
                ]}
            />
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <DataTable
                    data={users || []}
                    columns={columns}
                    selection={false}
                />
            </div>
        </>
    )
}