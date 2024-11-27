// src/components/custom/received-documents/completemodal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CompleteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (remarks: string) => void;
  initialRemarks?: string;
}

export const CompleteModal: React.FC<CompleteModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialRemarks = "",
}) => {
  const [remarks, setRemarks] = useState(initialRemarks);

  if (!open) return null;

  const handleProceed = () => {
    if (!remarks.trim()) {
      toast.error("Remarks are required.");
      return;
    }
    onSubmit(remarks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
        <h3 className="text-lg font-medium text-center mb-4">Complete Document</h3>
        <div className="space-y-4">
          <label className="text-sm text-gray-500">Remarks</label>
          <div className="border rounded-lg bg-gray-50 p-3">
            <Input
              className="w-full"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleProceed}
              className="bg-orange-500 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
