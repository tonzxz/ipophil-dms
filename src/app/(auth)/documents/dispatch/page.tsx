'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/custom/dashboard/header';
import { columns } from '@/components/custom/disptach-documents/columns';
import { DataTable } from '@/components/custom/disptach-documents/data-table';
import { useDispatchDocuments, useDocuments } from '@/lib/services/documents';
import {  useWebSocket } from '@/lib/services/global';
import TableSkeleton from '@/components/custom/common/table-skeleton';
import { useCount } from '@/lib/context/count-context';

const DocumentsPageContent = () => {
  const { documents, error, isLoading, mutate } = useDispatchDocuments();
  const { mutate: mutateAll} = useDocuments();
  const {message} = useWebSocket(['transits','documents']);
  const {notify} = useCount();


  useEffect(()=>{
    notify('dispatch');
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
            { label: 'New', active: true },
          ]}
        />
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <TableSkeleton columns={6} rows={8} />
        </div>
      </>
    );
  }


  
  if (error) {
    return (
      <>
        <DashboardHeader
          breadcrumbs={[
            { label: 'Documents', href: '/documents' },
            { label: 'New', active: true },
          ]}
        />
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <p className='text-red-500'>
            Error loading documents. Please try again later.
          </p>
        </div>
      </>
    );
  }


  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Documents', href: '/documents' },
          { label: 'New', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <DataTable data={documents || []} columns={columns} selection={true} />
      </div>
    </>
  );
};

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentsPageContent />
    </Suspense>
  );
}
