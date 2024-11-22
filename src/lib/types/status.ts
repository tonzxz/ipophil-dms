// src\lib\types\status.ts
export interface Stats {
    current: StatusCounts;
    percentageChanges: {
        dispatch: number;
        incoming: number;
        recieved: number;
        outgoing: number;
        completed: number;
    }
}

export interface StatusCounts {
    dispatch: number;
    incoming: number;
    recieved: number;
    outgoing: number;
    completed: number;
}