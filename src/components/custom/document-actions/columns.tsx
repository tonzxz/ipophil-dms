'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'name',
        header: 'Action Name',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.description || 'No description'}
            </span>
        ),
    },
    {
        accessorKey: 'sender_tag',
        header: 'Sender Tag',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.sender_tag}</span>
        ),
    },
    {
        accessorKey: 'recipient_tag',
        header: 'Recipient Tag',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.recipient_tag}</span>
        ),
    },
    {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.original.active;
            return (
                <Badge variant={isActive ? 'default' : 'secondary'} className="font-medium">
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
