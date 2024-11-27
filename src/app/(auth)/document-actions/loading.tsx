import TableSkeleton from '@/components/custom/common/table-skeleton'

export default function Loading() {
    return (
        <TableSkeleton columns={6} rows={8} />
    )
}