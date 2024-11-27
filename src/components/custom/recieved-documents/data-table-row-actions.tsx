// // src/components/custom/received-documents/data-table-row-actions.tsx

// 'use client'

// import { useState } from 'react';
// import { DotsHorizontalIcon } from '@radix-ui/react-icons';
// import { Row } from '@tanstack/react-table';
// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuRadioGroup,
//     DropdownMenuRadioItem,
//     DropdownMenuSeparator,
//     DropdownMenuShortcut,
//     DropdownMenuSub,
//     DropdownMenuSubContent,
//     DropdownMenuSubTrigger,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { documentsSchema, Document } from '@/lib/faker/documents/schema';
// import { statuses } from '@/lib/faker/documents/data';
// import { toast } from 'sonner';
// import { DocumentDialog } from '@/components/custom/common/document-dialog';
// import { useDocuments } from '@/lib/services/documents';

// interface DataTableRowActionsProps<TData> {
//     row: Row<TData>;
// }

// export function DataTableRowActions<TData>({
//     row,
// }: DataTableRowActionsProps<TData>) {
//     const [selectedItem, setSelectedItem] = useState<Document | null>(null);
//     const { releaseDocument, completeDocument } = useDocuments();
//     const document = documentsSchema.parse(row.original);

//     const handleAction = (e: React.MouseEvent, action: () => void) => {
//         e.stopPropagation();
//         action();
//     };

//     const handleCopyCode = () => {
//         navigator.clipboard.writeText(document.code);
//         toast.success('Document Code copied to clipboard');
//     };

//     const handleView = () => {
//         setSelectedItem(document);
//     };

//     const handleEdit = () => {
//         toast.info('Edit functionality coming soon');
//     };

//     // const handleRelease = async () => {
//     //     try {
//     //         await releaseDocument({
//     //             documentCode: document.code,
//     //             to_agency_id: document.receiving_office, // Adjust as needed
//     //         });
//     //         toast.success('Document released successfully');
//     //     } catch (error: any) {
//     //         toast.error(error.message || 'Failed to release document');
//     //     }
//     // };
//     const handleRelease = () => {
//         toast.info('Release functionality coming soon');
//     };

    // const handleComplete = async () => {
    //     try {
    //         await completeDocument({
    //             documentCode: document.code,
    //             remarks: 'Marking document as complete', 
    //         });
    //         toast.success('Document completed successfully');
    //     } catch (error: any) {
    //         toast.error(error.message || 'Failed to complete document');
    //     }
    // };

    // const handleStatusChange = (newStatus: string) => {
    //     toast.info(`Status change to ${newStatus} coming soon`);
    // };

//     // Function to delete document
//    const handleDelete = async () => {
//     try {
//         const res = await fetch(`/api/documents/${document.id}/deactivate`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })

//         if (!res.ok) {
//             const error = await res.json()
//             throw new Error(error.message || 'Failed to delete document.')
//         }

//         const deletedDoc = await res.json()
//         toast.success('Document successfully deleted.')
//     } catch (error) {
//         console.error('Error deleting document:', error)
//         toast.error( 'Failed to delete document.')
//     }
// }

//     return (
//         <>
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         variant="ghost"
//                         className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <DotsHorizontalIcon className="h-4 w-4" />
//                         <span className="sr-only">Open menu</span>
//                     </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-[160px]">
//                     <DropdownMenuItem onClick={(e) => handleAction(e, handleCopyCode)}>
//                         Copy Code
//                     </DropdownMenuItem>

//                     <DropdownMenuItem onClick={(e) => handleAction(e, handleView)}>
//                         View
//                     </DropdownMenuItem>

//                     {/* <DropdownMenuItem onClick={(e) => handleAction(e, handleEdit)}>
//                         Edit
//                     </DropdownMenuItem> */}

//                     <DropdownMenuItem onClick={(e) => handleAction(e, handleRelease)}>
//                         Release
//                     </DropdownMenuItem>

//                     <DropdownMenuItem onClick={(e) => handleAction(e, handleComplete)}>
//                         Complete
//                     </DropdownMenuItem>

//                     <DropdownMenuSeparator />

//                     {/* <DropdownMenuSub>
//                         <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
//                             Change Status
//                         </DropdownMenuSubTrigger>
//                         <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
//                             <DropdownMenuRadioGroup value={document.status}>
//                                 {statuses.map((status) => (
//                                     <DropdownMenuRadioItem
//                                         key={status.value}
//                                         value={status.value}
//                                         onClick={(e) =>
//                                             handleAction(e, () => handleStatusChange(status.value))
//                                         }
//                                     >
//                                         {status.label}
//                                     </DropdownMenuRadioItem>
//                                 ))}
//                             </DropdownMenuRadioGroup>
//                         </DropdownMenuSubContent>
//                     </DropdownMenuSub> */}

//                     <DropdownMenuSeparator />

//                     <DropdownMenuItem onClick={(e) => handleAction(e, handleDelete)}>
//                         Delete
//                         <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>

//             <DocumentDialog
//                 item={selectedItem}
//                 open={!!selectedItem}
//                 onClose={() => setSelectedItem(null)}
//             />
//         </>
//     );
// }

'use client'

import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { documentsSchema, Document } from '@/lib/faker/documents/schema';
import { toast } from 'sonner';
import { DocumentDialog } from '@/components/custom/common/document-dialog';
import { useDocuments } from '@/lib/services/documents';
import { ScanDocumentForm } from '../common/add-document/scan-document-form';
import { CompleteModal } from './completemodal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null);
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState<boolean>(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
    const [remarks, setRemarks] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { completeDocument } = useDocuments();
    const document = documentsSchema.parse(row.original);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(document.code);
        toast.success('Document Code copied to clipboard');
    };

    const handleView = () => {
        setSelectedItem(document);
    };

    const handleEdit = () => {
        toast.info('Edit functionality coming soon');
    };

    const handleRelease = () => {
        setIsReleaseModalOpen(true);
    };

    const handleComplete = () => {
        setIsCompleteModalOpen(true);
    };

    const handleMarkAsComplete = async () => {
        try {
            await completeDocument({
                documentCode: document.code,
                remarks,
            });
            toast.success('Document completed successfully');
            setIsCompleteModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to complete document');
        }
    };

    const handleStatusChange = (newStatus: string) => {
        toast.info(`Status change to ${newStatus} coming soon`);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/documents/${document.id}/deactivate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete document.');
            }

            const deletedDoc = await res.json();
            toast.success('Document successfully deleted.');
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Failed to delete document.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isLoading}
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={(e) => handleAction(e, handleCopyCode)}>
                        Copy Code
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => handleAction(e, handleView)}>
                        View
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem onClick={(e) => handleAction(e, handleEdit)}>
                        Edit
                    </DropdownMenuItem> */}

                    <DropdownMenuItem onClick={(e) => handleAction(e, handleRelease)}>
                        Release
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => handleAction(e, handleComplete)}>
                        Complete
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isLoading}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the document and remove its data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            <DocumentDialog
                item={selectedItem}
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />

            {isReleaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70">
                    <div className="relative bg-card p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <button
                            onClick={() => setIsReleaseModalOpen(false)}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>

                        <ScanDocumentForm
                            onSubmit={(data) => {
                                console.log("Form data:", data);
                                setIsReleaseModalOpen(false);
                            }}
                            onClose={() => setIsReleaseModalOpen(false)}
                            actionType="Release"
                            initialDocumentCode={document.code}
                        />
                    </div>
                </div>
            )}

                <CompleteModal
                    open={isCompleteModalOpen}
                    onClose={() => setIsCompleteModalOpen(false)}
                    onSubmit={async (remarks) => {
                        try {
                            await completeDocument({
                                documentCode: document.code,
                                remarks,
                            });

                            toast.success('Document completed successfully.');
                            setIsCompleteModalOpen(false); 
                        } catch (error: any) {
                            toast.error(error.message || 'Failed to complete document.');
                        }
                    }}
                    initialRemarks=""
                />

        </>
    );
}