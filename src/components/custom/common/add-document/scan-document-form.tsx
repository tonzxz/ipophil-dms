import scanAnimation from "../../../../../public/animation/scan.json";
import keyboardAnimation from "../../../../../public/animation/keyboard.json";
import Lottie from "react-lottie-player";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDocuments, useIncomingDocuments } from "@/lib/services/documents";
import { useAgencies } from "@/lib/services/agencies";
import { useDocumentActions } from "@/lib/services/document-actions";
import { ScanDocumentData, scanDocumentSchema } from "@/lib/validations/documents/scan_documents";
import { ActionType } from "@/lib/types/document-action-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JoinedDocument } from "@/lib/dms/joined-docs";
import { useSession } from "next-auth/react"; // or your auth provider

interface ScanDocumentFormProps {
  onSubmit: (data: ScanDocumentData) => void;
  onClose: () => void;
  actionType: ActionType;
  initialDocumentCode?: string;
}

export const ScanDocumentForm: React.FC<ScanDocumentFormProps> = ({
  onSubmit,
  onClose,
  actionType,
  initialDocumentCode
}) => {
  const { fetchOffTransitDocument, fetchInTransitDocument, releaseDocument, receiveDocument } = useDocuments();
  const { agencies = [], isLoading: isLoadingAgencies } = useAgencies();
  const { documentActions = [], isLoading: isLoadingActions } = useDocumentActions();
  const {mutate}= useIncomingDocuments()
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedCode, setLastProcessedCode] = useState("");
  const [completeCode, setCompleteCode] = useState("");

  const scannedCodeRef = useRef("");
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [documentCode, setDocumentCode] = useState(initialDocumentCode || "");
  const [documentDetails, setDocumentDetails] = useState<JoinedDocument | null>(null);
  const [searchMethod, setSearchMethod] = useState<"manual" | "qr" | null>(initialDocumentCode ? "manual" : null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [selectedRequestAction, setSelectedRequestAction] = useState<string | null>(null);
  const [selectedActionTaken, setSelectedActionTaken] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { setValue } = useForm<ScanDocumentData>({
    resolver: zodResolver(scanDocumentSchema),
  });

  useEffect(() => {
    if (initialDocumentCode) {
      handleSearch(initialDocumentCode);
    }
  }, [initialDocumentCode]);

  let inputTimeout: NodeJS.Timeout | null = null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentCode(value);
    console.log("Updated Document Code: ", value);

    // Debugging: log the current value as it is typed
    console.log("Input Value:", value);

    // Clear the previous debounce timeout
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
    }

    // If QR code is being scanned
    if (searchMethod === "qr") {
      setDocumentCode(value);

      // Clear any existing processing timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      // Debugging: Check the scanned value length
      console.log("Scanned QR Value:", value);

      // Delay processing for 1 second to capture full QR code
      processingTimeoutRef.current = setTimeout(() => {
        if (value.includes("-") && value.length >= 11) {
          setLastProcessedCode(value);
          toast.success(`Scanned code: ${value}`);
          handleSearch(value); // Pass the scanned value to handleSearch
        } else {
          toast.error("Incomplete QR code scan. Please try again.");
        }
      }, 1000); // Increased to 1 second for better scan timing
    } else {
      // Handle manual input (debounced)
      setDocumentCode(value);

      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }

      // Wait for 2 seconds of inactivity before processing
      inputTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          handleSearch(value); // Pass the manual input value to handleSearch
        }
      }, 2000); // Increased debounce time to 2 seconds
    }

    // Reset the buffer if no input received within 1 second
    inputTimeoutRef.current = setTimeout(() => {
      setDocumentCode("");
    }, 1000); // Reset after 1 second of inactivity
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(documentCode); // Pass the current documentCode to handleSearch
    }
  };

  const handleSearch = async (finalDocumentCode: string) => {
    // Ensure the correct value is being used for search
    console.log("Final Document Code for Fetch:", finalDocumentCode);
  
    if (!finalDocumentCode.trim()) {
      setIsProcessing(false);
      toast.error("No code provided. Please scan again.");
      return;
    }
  
    setIsLoading(true);
    try {
      console.log("Searching for document:", finalDocumentCode);
  
      // Determine the correct fetch function based on action type
      const fetchFunction = actionType === "Release"
        ? fetchOffTransitDocument
        : fetchInTransitDocument;
  
      // Ensure the fetch function is available
      if (!fetchFunction) {
        throw new Error("Invalid action type. Fetch function is not available.");
      }
  
      const document = await fetchFunction(finalDocumentCode);
  
      if (!document) {
        throw new Error("Document not found. Please try again.");
      }
  
      if (actionType === 'Receive') {
        setSelectedRequestAction(document.sender_action_id!);
      }
  
      setDocumentDetails(document);
      toast.success("Document found!");
  
      // Clear states on success
      if (searchMethod === "qr") {
        setDocumentCode(""); // Optionally clear code after search
      }
    } catch (error: any) {
      // Log error details
      console.error("Error fetching document:", error);
  
      if (error.response && error.response.status === 404) {
        toast.error("Document not found. Please check the code and try again.");
      } else {
        toast.error(error.message || "An unexpected error occurred. Please try again.");
      }
  
      setDocumentDetails(null);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };
  

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (inputTimeout) {
        clearTimeout(inputTimeout);
      }
      setIsProcessing(false);
      setLastProcessedCode("");
      setCompleteCode("");
    };
  }, [searchMethod]);

  // Add session monitoring
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to continue');
    }
  }, [status]);

  const handleProceed = async () => {
    if (!documentDetails) {
      toast.error("Please search for a document first.");
      return;
    }

    if (!session || status !== "authenticated") {
      toast.error("Please refresh the page and try again.");
      return;
    }

    // Logic for "Release"
    if (actionType === "Release") {
      if (!selectedAgency) {
        toast.error("Please select an agency to release the document.");
        return;
      }

      if (!selectedRequestAction) {
        toast.error("Please select a request action.");
        return;
      }

      try {
        setIsLoading(true);
        await releaseDocument({
          documentCode: documentDetails.code,
          to_agency_id: selectedAgency!,
          remarks,
          documentAction: selectedRequestAction!,
        });
        mutate();
        toast.success("Document released successfully.");
        onClose();
      } catch (error: any) {
        console.error("Error releasing document:", error);
        toast.error(error.message || "Failed to release the document.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Logic for "Receive"
    if (actionType === "Receive") {
      if (!selectedActionTaken) {
        toast.error("Please select an action taken.");
        return;
      }

      try {
        setIsLoading(true);
        await receiveDocument({
          documentCode: documentDetails.code,
          remarks,
          documentAction: selectedActionTaken!,
        });
        mutate();
        toast.success("Document received successfully.");
        onClose();
      } catch (error: any) {
        console.error("Error receiving document:", error);
        toast.error(error.message || "Failed to receive the document.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  const resetForm = () => {
    setSearchMethod(null);
    setDocumentDetails(null);
    setDocumentCode("");
    setRemarks("");
    setSelectedRequestAction(null);
    setSelectedActionTaken(null);
    setIsProcessing(false);
    setLastProcessedCode("");
    scannedCodeRef.current = "";
    
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
  };

  const handleSearchButtonClick = () => {
    handleSearch(documentCode);
  };

  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-lg">
      <div className="relative h-full w-full">
        <div className="flex items-center gap-2 mb-4 p-4 border-b">
          {searchMethod && !initialDocumentCode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h3 className="text-lg font-medium">
              {initialDocumentCode ? `${actionType} Document` :
                searchMethod
                  ? searchMethod === "manual"
                    ? "Manual Search"
                    : "QR Code Scan"
                  : `${actionType} Document`
              }
            </h3>
            <p className="text-sm text-gray-500">
              {initialDocumentCode ? "Review document details" :
                searchMethod
                  ? searchMethod === "manual"
                    ? "Enter the document code to search"
                    : "Scan the document's QR code"
                  : "Select your preferred search method"
              }
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center space-y-4 w-full">
          {!searchMethod && !initialDocumentCode ? (
            <div className="flex justify-between items-center w-full max-w-lg space-x-2">
              <Button
                variant="outline"
                className="flex-1 flex flex-col items-center justify-center h-40"
                onClick={() => setSearchMethod("manual")}
              >
                <Lottie
                  animationData={keyboardAnimation}
                  play
                  style={{ width: 80, height: 80 }}
                  className="mb-1"
                />
                <span className="font-medium">Manual Search</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex flex-col items-center justify-center h-40"
                onClick={() => setSearchMethod("qr")}
              >
                <Lottie
                  animationData={scanAnimation}
                  play
                  style={{ width: 80, height: 80 }}
                  className="mb-1"
                />
                <span className="font-medium">QR Code Scan</span>
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-lg space-y-4">
              {!initialDocumentCode && searchMethod === "manual" && (
                <div className="flex flex-col items-center space-y-2 w-full">
                  {!documentDetails && (
                    <div className="flex gap-2 items-center w-full justify-center">
                      <Input
                        value={documentCode}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter document code"
                        className="flex-1 w-full"
                      />
                      <Button
                        onClick={handleSearchButtonClick}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4"
                      >
                        {isLoading ? "Searching..." : "Search"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!initialDocumentCode && searchMethod === "qr" && (
                <div className="flex flex-col items-center justify-center h-24 space-y-2 w-full">
                  <div className="relative">
                    <Lottie
                      animationData={scanAnimation}
                      play
                      style={{ width: 60, height: 60 }}
                      className="opacity-70"
                    />
                    <Input
                      value={documentCode}
                      onChange={handleInputChange}
                      className="opacity-0 absolute inset-0 cursor-default"
                      autoFocus
                      disabled={isLoading}
                      aria-label="QR Code Scanner Input"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {isLoading ? "Processing..." : 
                     isProcessing ? "Reading code..." :
                     "Place QR code under the scanner"}
                  </p>
                  {completeCode && !isLoading && (
                    <p className="text-xs text-gray-400">
                      Code: {completeCode}
                    </p>
                  )}
                </div>
              )}

              {documentDetails && (
                <div className="border rounded-md p-4 space-y-4 bg-gray-50 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Document Code</label>
                      <Input value={documentDetails.code} readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <Input value={documentDetails.title} readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Classification</label>
                      <Input value={documentDetails.classification} readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Created By</label>
                      <Input value={documentDetails.created_by} readOnly />
                    </div>
                  </div>

                  {actionType === "Release" && (
                    <div>
                      <label className="text-sm text-gray-500">Release to:</label>
                      <Select
                        onValueChange={(value) => setSelectedAgency(value)}
                        value={selectedAgency || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingAgencies ? "Loading agencies..." : "Bureau/Office/Division"} />
                        </SelectTrigger>
                        <SelectContent>
                          {agencies.map((agency) => (
                            <SelectItem key={agency.agency_id} value={agency.agency_id}>
                              {agency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-500">
                      {actionType === "Release" ? "Request Action:" : "Action Requested:"}
                    </label>
                    <Select
                      onValueChange={(value) => setSelectedRequestAction(value)}
                      disabled={actionType === "Receive"}
                      value={selectedRequestAction || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingActions ? "Loading actions..." : actionType === "Release" ? "Select an action" : "None"} />
                      </SelectTrigger>
                      <SelectContent>
                        {documentActions.map((action) => (
                          <SelectItem key={action.action_id} value={action.action_id}>
                            {action.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {actionType === "Receive" && (
                    <div>
                      <label className="text-sm text-gray-500">Action Taken:</label>
                      <Select
                        onValueChange={(value) => setSelectedActionTaken(value)}
                        value={selectedActionTaken || ""}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={isLoadingActions ? "Loading actions..." : "Select an action"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {documentActions.map((action) => (
                            <SelectItem key={action.action_id} value={action.action_id}>
                              {action.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-500">Remarks:</label>
                    <Input
                      className="shadow-lg w-full"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end w-full">
                <Button
                  onClick={handleProceed}
                  disabled={!documentDetails || isLoading}
                  className="bg-orange-500 text-white px-6"
                >
                  {isLoading ? "Processing..." : "Proceed"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};