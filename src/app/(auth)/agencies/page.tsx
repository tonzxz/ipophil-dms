// src/app/(auth)/agencies/page.tsx

'use client';
import { useAgencies } from '@/lib/services/agencies';
import { columns } from '@/components/custom/agencies/columns';
import { DashboardHeader } from '@/components/custom/dashboard/header';
import { DataTable } from '@/components/custom/agencies/data-table';
import TableSkeleton from '@/components/custom/common/table-skeleton';

export default function AgenciesPage() {
    const { agencies, error, isLoading } = useAgencies();

    if (isLoading) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[{ label: 'Agencies', active: true }]}
                />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <TableSkeleton columns={6} rows={8} />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <DashboardHeader
                    breadcrumbs={[{ label: 'Agencies', active: true }]}
                />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <p className="text-red-500">Error loading agencies. Please try again later.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[{ label: 'Agencies', active: true }]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <DataTable
                    data={agencies || []}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    );
}
