import { Document } from '../faker/documents/schema'
import { TrailEntry } from './TrailEntry'
export type StepStatus = 'completed' | 'current' | 'pending' | 'error'

export interface RoutingStep {
    title: string
    description: string
    status: StepStatus
    date?: string
    office?: string
    user?: string
}

export interface DocumentRoutingProps {
    document: Document
}

export interface DocumentTrailsProps {
    document: Document
}