// import scanAnimation from "../../../../../public/animation/scan.json"; // QR Code Scan animation
// import keyboardAnimation from "../../../../../public/animation/keyboard.json"; // Manual Search animation
// import Lottie from "react-lottie-player";
// import { toast } from "sonner";
// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDocuments } from "@/lib/services/documents";
// import { useAgencies } from "@/lib/services/agencies";
// import { useDocumentActions } from "@/lib/services/document-actions";
// import { ScanDocumentData, scanDocumentSchema } from "@/lib/validations/documents/scan_documents";
// import { ActionType } from "@/lib/types/document-action-type";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { JoinedDocument } from "@/lib/dms/joined-docs";

// interface ScanDocumentFormProps {
//   onSubmit: (data: ScanDocumentData) => void;
//   onClose: () => void;
//   actionType: ActionType;
// }

// export const ScanDocumentForm: React.FC<ScanDocumentFormProps> = ({ onSubmit, onClose, actionType }) => {
//   const { fetchOffTransitDocument, fetchInTransitDocument, releaseDocument, receiveDocument } = useDocuments();
//   const { agencies = [], isLoading: isLoadingAgencies } = useAgencies();
//   const { documentActions = [], isLoading: isLoadingActions } = useDocumentActions();

//   const [documentCode, setDocumentCode] = useState("");
//   const [documentDetails, setDocumentDetails] = useState<JoinedDocument | null>(null);
//   const [searchMethod, setSearchMethod] = useState<"manual" | "qr" | null>(null);
//   const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
//   const [selectedRequestAction, setSelectedRequestAction] = useState<string | null>(null);
//   const [selectedActionTaken, setSelectedActionTaken] = useState<string | null>(null);
//   const [remarks, setRemarks] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { setValue } = useForm<ScanDocumentData>({
//     resolver: zodResolver(scanDocumentSchema),
//   });

//   // Timeout handler to manage input delay
//   let inputTimeout: NodeJS.Timeout | null = null;

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setDocumentCode(value);
//     console.log("Scanned Document Code:", value);

//     // Clear the previous timeout to prevent multiple calls
//     if (inputTimeout) {
//       clearTimeout(inputTimeout);
//     }

//     // Set a new timeout to wait until the user stops typing or scanning
//     inputTimeout = setTimeout(() => {
//       if (value.length >= 10) { // Assuming 10 is the expected length for a complete code
//         console.log("Searching for document with complete code:", value);
//       } else {
//         console.log("Document code is not yet complete:", value);
//       }
//     }, 500); // Increased delay to 500ms
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       console.log("Enter key pressed, triggering search");
//       handleSearch();
//     }
//   };

//   const handleSearch = async () => {
//     if (!documentCode.trim()) {
//       toast.error("Please enter a document code.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const fetchFunction = actionType === "Release" ? fetchOffTransitDocument : fetchInTransitDocument;
//       const document = await fetchFunction(documentCode);

//       if (actionType == 'Receive') {
//         setSelectedRequestAction(document.sender_action_id!);
//       }

//       setDocumentDetails(document);
//       toast.success("Document found.");
//     } catch (error: any) {
//       console.error("Error fetching document:", error);
//       toast.error(error.message || "Document not found.");
//       setDocumentDetails(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleProceed = async () => {
//     if (!documentDetails) {
//       toast.error("Please search for a document first.");
//       return;
//     }

//     if (actionType === "Release") {
//       if (!selectedAgency) {
//         toast.error("Please select an agency to release the document.");
//         return;
//       }

//       if (!selectedRequestAction) {
//         toast.error("Please select a request action.");
//         return;
//       }
//     }

//     if (actionType !== "Release" && !selectedActionTaken) {
//       toast.error("Please select an action taken.");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       if (actionType === "Release") {
//         await releaseDocument({
//           documentCode: documentDetails.code,
//           to_agency_id: selectedAgency!,
//           remarks,
//           documentAction: selectedRequestAction!,
//         });
//         toast.success("Document released successfully.");
//       } else if (actionType === "Receive") {
//         await receiveDocument({
//           documentCode: documentDetails.code,
//         });
//         toast.success("Document received successfully.");
//       }

//       onClose();
//     } catch (error: any) {
//       console.error("Error processing document:", error);
//       toast.error(error.message || error.details || `Failed to ${actionType} document.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSearchMethod(null);
//     setDocumentDetails(null);
//     setDocumentCode("");
//     setRemarks("");
//     setSelectedRequestAction(null);
//     setSelectedActionTaken(null);
//   };

//   return (
//     <div className="w-full mx-auto p-6 rounded-lg shadow-lg">
//       <div className="relative h-full w-full">
//         {/* Modal Header */}
//         <div className="flex items-center gap-2 mb-4 p-4 border-b">
//           {searchMethod && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={resetForm}
//               className="h-8 w-8"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           )}
//           <div>
//             <h3 className="text-lg font-medium">
//               {searchMethod
//                 ? searchMethod === "manual"
//                   ? "Manual Search"
//                   : "QR Code Scan"
//                 : `${actionType} Document`}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {searchMethod
//                 ? searchMethod === "manual"
//                   ? "Enter the document code to search"
//                   : "Scan the document's QR code"
//                 : "Select your preferred search method"}
//             </p>
//           </div>
//         </div>

//         {/* Modal Content */}
//         <div className="flex flex-col justify-center items-center space-y-4 w-full">
//           {!searchMethod ? (
//             <div className="flex justify-between items-center w-full max-w-lg space-x-2">
//               <Button
//                 variant="outline"
//                 className="flex-1 flex flex-col items-center justify-center h-40"
//                 onClick={() => setSearchMethod("manual")}
//               >
//                 <Lottie
//                   animationData={keyboardAnimation}
//                   play
//                   style={{ width: 80, height: 80 }}
//                   className="mb-1"
//                 />
//                 <span className="font-medium">Manual Search</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1 flex flex-col items-center justify-center h-40"
//                 onClick={() => setSearchMethod("qr")}
//               >
//                 <Lottie
//                   animationData={scanAnimation}
//                   play
//                   style={{ width: 80, height: 80 }}
//                   className="mb-1"
//                 />
//                 <span className="font-medium">QR Code Scan</span>
//               </Button>
//             </div>
//           ) : (
//             <div className="w-full max-w-lg space-y-4">
//               {searchMethod === "manual" && (
//                 <div className="flex flex-col items-center space-y-2 w-full">
//                   {!documentDetails && (
//                     <div className="flex gap-2 items-center w-full justify-center">
//                       <Input
//                         value={documentCode}
//                         onChange={handleInputChange}
//                         onKeyDown={handleKeyPress}
//                         placeholder="Enter document code"
//                         className="flex-1 w-full"
//                       />
//                       <Button
//                         onClick={handleSearch}
//                         disabled={isLoading}
//                         className="bg-blue-500 text-white px-4"
//                       >
//                         {isLoading ? "Searching..." : "Search"}
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {searchMethod === "qr" && (
//                 <div className="flex flex-col items-center justify-center h-24 space-y-2 w-full">
//                   <Lottie
//                     animationData={scanAnimation}
//                     play
//                     style={{ width: 60, height: 60 }}
//                     className="opacity-70"
//                   />
//                   <Input
//                     value={documentCode}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyPress}
//                     className="opacity-0 absolute"
//                     autoFocus
//                   />
//                   <p className="text-sm text-gray-500">
//                     {isLoading ? "Scanning..." : "Place QR code under the scanner"}
//                   </p>
//                 </div>
//               )}

              

//               {documentDetails && (
//                 <div className="border rounded-md p-4 space-y-4 bg-gray-50 w-full">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm text-gray-500">Document Code</label>
//                       <Input value={documentDetails.code} readOnly />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-500">Name</label>
//                       <Input value={documentDetails.title} readOnly />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-500">Classification</label>
//                       <Input value={documentDetails.classification} readOnly />
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-500">Created By</label>
//                       <Input value={documentDetails.created_by} readOnly />
//                     </div>
//                   </div>
//                   {actionType === "Release" && (
//                     <div>
//                       <label className="text-sm text-gray-500">Release to:</label>
//                       <Select
//                         onValueChange={(value) => setSelectedAgency(value)}
//                         value={selectedAgency || ""}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder={isLoadingAgencies ? "Loading agencies..." : "Select an agency"} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {agencies.map((agency) => (
//                             <SelectItem key={agency.agency_id} value={agency.agency_id}>
//                               {agency.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   )}
//                   <div>
//                     <label className="text-sm text-gray-500">
//                       {actionType === "Release" ? "Request Action:" : "Action Requested:"}
//                     </label>
//                     <Select
//                       onValueChange={(value) => setSelectedRequestAction(value)}
//                       disabled={actionType === "Receive"}
//                       value={selectedRequestAction || ""}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder={isLoadingActions ? "Loading actions..." : actionType === "Release" ? "Select an action" : "None"} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {documentActions.map((action) => (
//                           <SelectItem key={action.action_id} value={action.action_id}>
//                             {action.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                  {actionType === "Receive"  && (<>
//                   <div>
//                     <label className="text-sm text-gray-500">Action Taken:</label>
//                     <Select
//                       onValueChange={(value) => setSelectedActionTaken(value)}
//                       value={selectedActionTaken || ""}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder={isLoadingActions ? "Loading actions..." : "Select an action"} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {documentActions.map((action) => (
//                           <SelectItem key={action.action_id} value={action.action_id}>
//                             {action.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                  </>)}
//                   <div>
//                     <label className="text-sm text-gray-500">Remarks:</label>
//                     <Input
//                       className="shadow-lg w-full"
//                       value={remarks}
//                       onChange={(e) => setRemarks(e.target.value)}
//                       placeholder="Enter remarks"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Proceed Button */}
//               <div className="flex justify-end w-full">
//                 <Button
//                   onClick={handleProceed}
//                   disabled={!documentDetails || isLoading}
//                   className="bg-orange-500 text-white px-6"
//                 >
//                   {isLoading ? "Processing..." : "Proceed"}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import scanAnimation from "../../../../../public/animation/scan.json";
import keyboardAnimation from "../../../../../public/animation/keyboard.json";
import Lottie from "react-lottie-player";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDocuments } from "@/lib/services/documents";
import { useAgencies } from "@/lib/services/agencies";
import { useDocumentActions } from "@/lib/services/document-actions";
import { ScanDocumentData, scanDocumentSchema } from "@/lib/validations/documents/scan_documents";
import { ActionType } from "@/lib/types/document-action-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JoinedDocument } from "@/lib/dms/joined-docs";

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
      handleSearch();
    }
  }, [initialDocumentCode]);

  let inputTimeout: NodeJS.Timeout | null = null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentCode(value);

    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }

    inputTimeout = setTimeout(() => {
      if (value.length >= 10) {
        handleSearch();
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!documentCode.trim()) {
      // toast.error("Please enter a document code.");
      return;
    }

    setIsLoading(true);
    try {
      const fetchFunction = actionType === "Release" ? fetchOffTransitDocument : fetchInTransitDocument;
      const document = await fetchFunction(documentCode);

      if (actionType === 'Receive') {
        setSelectedRequestAction(document.sender_action_id!);
      }

      setDocumentDetails(document);
      toast.success("Document found.");
    } catch (error: any) {
      console.error("Error fetching document:", error);
      toast.error(error.message || "Document not found.");
      setDocumentDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!documentDetails) {
      toast.error("Please search for a document first.");
      return;
    }

    if (actionType === "Release") {
      if (!selectedAgency) {
        toast.error("Please select an agency to release the document.");
        return;
      }

      if (!selectedRequestAction) {
        toast.error("Please select a request action.");
        return;
      }
    }

    if (actionType !== "Release" && !selectedActionTaken) {
      toast.error("Please select an action taken.");
      return;
    }

    try {
      setIsLoading(true);

      if (actionType === "Release") {
        await releaseDocument({
          documentCode: documentDetails.code,
          to_agency_id: selectedAgency!,
          remarks,
          documentAction: selectedRequestAction!,
        });
        toast.success("Document released successfully.");
      } else if (actionType === "Receive") {
        await receiveDocument({
          documentCode: documentDetails.code,
        });
        toast.success("Document received successfully.");
      }

      onClose();
    } catch (error: any) {
      console.error("Error processing document:", error);
      toast.error(error.message || error.details || `Failed to ${actionType} document.`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSearchMethod(null);
    setDocumentDetails(null);
    setDocumentCode("");
    setRemarks("");
    setSelectedRequestAction(null);
    setSelectedActionTaken(null);
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
                        onClick={handleSearch}
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
                  <Lottie
                    animationData={scanAnimation}
                    play
                    style={{ width: 60, height: 60 }}
                    className="opacity-70"
                  />
                  <Input
                    value={documentCode}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="opacity-0 absolute"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500">
                    {isLoading ? "Scanning..." : "Place QR code under the scanner"}
                  </p>
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
                          <SelectValue placeholder={isLoadingAgencies ? "Loading agencies..." : "Select an agency"} />
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
                          <SelectValue placeholder={isLoadingActions ? "Loading actions..." : "Select an action"} />
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