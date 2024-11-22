// First, let's define the brand type
import { SelectItem } from '@/components/ui/select'
import { Agency } from '@/lib/types/agency'

interface AgencyOptionsProps {
    agencies: Agency[] | undefined
    isLoading: boolean
    error: Error | null
}

export const AgencyOptions: React.FC<AgencyOptionsProps> = ({ agencies, isLoading, error }) => {
    if (error) {
        return <SelectItem value="error" disabled>Error loading agencies</SelectItem>
    }

    if (isLoading) {
        return <SelectItem value="loading" disabled>Loading agencies...</SelectItem>
    }

    if (!agencies?.length) {
        return <SelectItem value="empty" disabled>No agencies available</SelectItem>
    }

    return agencies.map((agency) => (
        <SelectItem key={agency.agency_id} value={agency.agency_id}>
            {agency.name}
        </SelectItem>
    ))
}