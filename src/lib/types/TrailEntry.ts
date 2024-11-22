export interface TrailEntry {
    id: string;
    date: string;
    from: string;
    to: string;
    actionRequested: string;
    actionTaken: string;
    remarks: string;
    deliveryMethod: 'mail' | 'facsimile' | 'email' | 'personal';
    receiver: string;
    isUrgent: boolean;
    status: 'completed' | 'current' | 'pending';
    timeReceived?: string;
    documentType?: string;
    isOrigin: boolean;
  }
