
'use client'

// src\app\(auth)\reports\page.tsx
import {ReportGenerator} from "@/components/custom/report-generator/report-generator"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { useDocumentLogs } from "@/lib/services/documents"
import { useAgencies } from "@/lib/services/agencies";
import { useDocumentTypes } from "@/lib/services/document-types";
import TableSkeleton from "@/components/custom/common/table-skeleton";


export default function ReportsPage() {
    const {documents, isLoading:logsLoading, error:logsError} = useDocumentLogs();
    const {agencies, isLoading:agenciesLoading, error:agenciesError} = useAgencies()
    const {documentTypes, isLoading:typesLoading , error:typesError} = useDocumentTypes();
    
    if (logsLoading||agenciesLoading||typesLoading) {
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

    if (logsError||agenciesError||typesError) {
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
                    { label: "Reports", href: "/reports", active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <ReportGenerator
                types={!documentTypes ? [] : documentTypes?.map((types)=>({value: types.name, label: types.name}))}
                offices={!agencies ? [] : agencies?.map((agency)=>({value: agency.name, label: agency.name}))}
                data={documents!} />
            </div>
        </>
    );
}
