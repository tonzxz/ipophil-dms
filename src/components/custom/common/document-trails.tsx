import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText,
  History,
  Mail,
  Printer,
  User,
  CheckCircle,
  Clock,
  Building,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import EmptyLottie from '@/components/custom/animation/LottieLoader';
import html2pdf from 'html2pdf.js';
import AnnexDForm from './annex-d-form';
import { DocumentTrailsProps } from '@/lib/types';
import { useDocuments } from '@/lib/services/documents';
import { TrailEntry } from '@/lib/types/TrailEntry';
import { toast } from 'sonner';



const DeliveryMethodIcon: Record<string, React.ComponentType<any>> = {
  mail: Mail,
  facsimile: Printer,
  email: Mail,
  personal: User,
};

export default function  DocumentTrails({document:_document}:DocumentTrailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [trails, setTrails] = useState<TrailEntry[]>([]);
  const {getDocumentTrails} = useDocuments();

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true)
      try {
        const trails = await getDocumentTrails({ tracking_code: _document.code });
        setTrails([
          {
            id: _document.id + 'Z',
            date: _document.date_created,
            from: _document.origin_office,
            to: _document.origin_office,
            isOrigin: true,
            actionRequested: 'Creation',
            actionTaken: 'Created',
            remarks: 'Document Created',
            deliveryMethod:'personal',
            receiver: _document.created_by,
            isUrgent: true,
            status: 'completed',
            timeReceived: _document.date_created,
            documentType: _document.type,
          },
         ...trails 
        ]);
      } catch (error) {
        console.error('Error fetching document trails:', error);
      }
      setLoading(false)
    };

    fetchTrails();
  }, [_document.code]);

  const handleLatestUpdates = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleExportPDF = () => {
    const container = document.createElement('div');
    container.innerHTML = AnnexDForm({ document: _document, trails: trails.slice(1) });
    document.body.appendChild(container);

    html2pdf()
      .from(container)
      .set({
        margin: 0.5,
        filename: 'document-trails.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .save()
      .finally(() => {
        document.body.removeChild(container);
      });
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg"> 
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">Document Trail History</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={handleLatestUpdates}
          >
            <History className="mr-2 h-5 w-5" />
            Latest Updates
          </Button>
          {(<>
            <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={handleExportPDF}
          >
            <FileText className="mr-2 h-5 w-5" />
            Print Document Trails
          </Button>
          </>)}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <EmptyLottie
            animationPath="/animation/loading.json"
            message="Loading Updates..."
            description="Please wait while we fetch the latest updates."
            className="w-40"
          />
        ) : (
          <div className="relative space-y-8">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {trails.map((trail,index) => (
              <div key={index} className="relative flex items-start space-x-4">
                <div
                  className={cn(
                    'flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-sm',
                    trail.status === 'completed'
                      ? 'bg-green-500'
                      : trail.status === 'current'
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  )}
                >
                  {trail.status === 'completed' ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : trail.status === 'current' ? (
                    <Clock className="w-8 h-8 text-white" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-white" />
                  )}
                </div>

                <Card className="flex-1 bg-card p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-gray-500">{trail.date}</div>
                      {/* <div
                        className={cn(
                          'px-3 py-1 rounded-full text-sm',
                          trail.isUrgent ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                        )}
                      >
                        {trail.isUrgent ? 'Urgent' : 'Regular'}
                      </div> */}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{trail.from}</span>
                      </div>
                      {!trail.isOrigin &&(<>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{trail.to}</span>
                      </div>
                      </>)}
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">RECEIVER</div>
                        <div className="text-sm flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {trail.receiver}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">DELIVERY METHOD</div>
                        <div className="flex items-center gap-2">
                          {React.createElement(DeliveryMethodIcon[trail.deliveryMethod], {
                            className: 'h-4 w-4 text-gray-400',
                          })}
                          <span className="text-sm capitalize">{trail.deliveryMethod}</span>
                        </div>
                      </div>

                      {trail.status == 'pending' && (
                        <>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">ACTION REQUESTED</div>
                            <div className="text-sm">{trail.actionRequested}</div>
                          </div>
                        </>
                      )}

                    {trail.status != 'pending' && (
                        <>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">ACTION TAKEN</div>
                            <div className="text-sm">{trail.actionTaken}</div>
                          </div>
                        </>
                      )}

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">REMARKS</div>
                        <div className="text-sm">{trail.remarks}</div>
                      </div>
                    </div>

                    {trail.status === 'completed' && trail.timeReceived && (
                      <div className="flex items-center gap-2 text-green-600 text-sm mt-4">
                        <CheckCircle className="h-4 w-4" />
                        Completed at {trail.timeReceived}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


