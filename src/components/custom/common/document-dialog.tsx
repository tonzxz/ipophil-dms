import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Document } from '@/lib/faker/documents/schema'
import { Icons } from '@/components/ui/icons'
import DocumentRouting from './document-routing'
import { Separator } from '@/components/ui/separator'
import DocumentMetadata from './document-metadata'
import DocumentTrails from './document-trails'

interface DocumentDialogProps {
    item: Document | null
    open: boolean
    onClose: () => void
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({ item, open, onClose }) => {
    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] w-[1000px] h-[90vh] flex flex-col overflow-hidden p-0'>
                <div className='flex flex-col h-full'>
                    <DialogHeader className='p-4 flex-shrink-0'>
                        <DialogTitle>{item.title.toUpperCase()}</DialogTitle>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icons.fileText className='h-4 w-4' />
                            CODE: {item.code}
                        </div>
                    </DialogHeader>

                    <Separator className='flex-shrink-0' />

                    <Tabs defaultValue='routing' className='flex-1 flex flex-col min-h-0'>
                        <div className='px-6 py-2 flex flex-shrink-0'>
                            <TabsList className='grid grid-cols-2 w-auto'>
                                {/* <TabsTrigger value='routing'>Routing</TabsTrigger> */}
                                <TabsTrigger value='details'>Document Details</TabsTrigger>
                                <TabsTrigger value='trails'>Document Routing</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className='px-6 py-2 flex-1 overflow-auto'>
                            <TabsContent value='details' className='m-0 mt-0 h-full'>
                                <DocumentMetadata item={item} />
                            </TabsContent>
                            <TabsContent value='trails' className='m-0 mt-0 h-full'>
                                <DocumentTrails document={item} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}