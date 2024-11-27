import { Document } from '../../../lib/faker/documents/schema';
interface AnnexDFormProps {
  document: Document;
  trails: {
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
  }[];
}

const Logo = "/images/logo.png";

const AnnexDForm = ({ document:_document, trails }: AnnexDFormProps) => {
  const generatePDFContent = () => `
    <h1 style="margin: 0; margin-bottom:20px; font-weight:bold; text-align: center; font-size: 18px;">ANNEX "D"</h1>
    <div style="font-family: Arial, sans-serif; padding: 0px; width: 7.5in; height: 10in; ">
      <div style="display: flex;">
        <div style="display: flex; flex-direction:row; width: 100%; border: 1px solid black;">

          <div style="width: 25%; display: flex; border: 1px solid black; justify-content:center;">
            <img src="${Logo}" alt="IPOPHIL Logo" style="width: 75%; height: auto;"/>
          </div>


          <div style="width: 50%; height:100%; text-align: center; display: flex; flex-direction: column;">
            <div style="height: 35%; align-items: center; font-size: 14px; font-weight: bold; border: 1px solid black;">
              Quality Form
            </div>
            <div style="height: 30%; align-items: center; font-size: 12px; font-weight: bold; border: 1px solid black;">
              Control of Document Procedure 
            </div>
            <div style="height: 35%; align-items:center; font-size: 14px; font-weight: bold; border: 1px solid black;">
              Document Routing and Tracking Form
            </div>
          </div>

          <div style="width:25%; height:100%; text-align: right; font-size: 12px; display: flex; flex-direction: column;">
            <div style="display:flex; height:35%; flex-direction:row; text-align:start; align-items: center; border: 1px solid black; padding-left:3px; padding-bottom:10px; gap:3px;">
              
              <span style="font-weight:bold; font-size:12px;">Doc No. </span>
              ${_document.code}
              
            </div>
            <div style="height: 30%; display:flex; flex-direction:row; text-align:start; align-items: center; border: 1px solid black; padding-left:3px; gap:3px; padding-bottom:10px;">
              <span style="font-weight:bold;">Rev No.</span>
              <span> 01 </span>
            </div>
            
            <div style="height:35%; display:flex; text-align:start; flex-direction:row; border: 1px solid black; gap:1px;">
              <div style="width:50%; padding:3px; font-weight:bold;">
                Issued by: 
              </div>
              <div style="width:50%; border-left:solid;">
                ${_document.created_by}
              </div>
            </div>
            
          </div>
          
        </div>

        
      </div>

      <table style="width: 100%; border-collapse: collapse; border-left: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-top: none; margin-bottom: 10px;">
        <tr>
          <td style="width: 25%; font-weight: bold; padding: 10px; border: 1px solid black;">Origin</td>
          <td style="width: 50%; padding: 10px; border: 1px solid black;">[ ] IPOPHL  [ ] External</td>
          <td style="width: 12.5%; font-weight: bold; padding: 10px; border: 1px solid black;">Date</td>
          <td style="width: 12.5%; padding: 2px; border: 1px solid black;">
            ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </td>
        </tr>
        <tr>
          <td style="width: 25%; font-weight: bold; padding: 10px; border: 1px solid black;">Office/Bureau</td>
          <td colspan="3" style="padding: 2px; border: 1px solid black;">${_document.origin_office}</td>
        </tr>
        <tr>
          <td style="width: 25%; font-weight: bold; padding: 10px; border: 1px solid black;">Subject/Document Title</td>
          <td colspan="3" style="padding: 10px; padding-left: 3px; border: 1px solid black;">${_document.type || ''}</td>
        </tr>
        <tr>
          <td colspan="4" style="padding: 0; border: 1px solid black;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 25%; font-weight: bold; padding: 10px; border-right: 2px solid black; ">Date of Document</td>
                <td style="width: 25%; padding: 10px; text-align: center; border-right: 2px solid black;">
                ${new Date(_document.date_created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
                </td>
                <td style="width: 25%; font-weight: bold; padding: 10px; border-right: 2px solid black; ">Date and Time Received</td>
                <td style="width: 25%; padding: 10px; text-align: center;">
                ${  new Date(trails[trails.length-1]?.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid black; font-weight: bold;">Means of delivery / transmission:</td>
          <td colspan="3" style="padding: 10px; border: 1px solid black;">
            [ ] Mail  [ ] Facsimile  [ ] E-mail  [ ] Personal Delivery
          </td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
        <thead>
          <tr>
            <th colspan="7" style="border: 1px solid black; padding: 4px; text-align: left; padding:10px; color: red;">
              <div style="display: flex; justify-content: space-between; width: 100%;">
                <span>Ref No. ${new Date(_document.date_created).toLocaleDateString('en-US', {
                  year: 'numeric',
                })}-${_document.code}</span>
                <span>URGENT [Y/N]</span>
              </div>
            </th>
          </tr>
          <tr>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">Date/Time</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">To</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">From</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">Receiver</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">Action Requested</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">Remarks</th>
            <th style="border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle;">Status</th>
          </tr>
        </thead>

        <tbody>
          ${
      trails.length == 0  ? `
            <tr>
              <td colspan="7" style="border: 1px solid black; padding: 4px; text-align: center; ">
                This document has no trails yet.
              </td>
            </tr>
      `
            :
            trails
      .map(
        (trail) => `
              <tr>
                <td style="border: 1px solid black; padding: 4px;">
                   ${  new Date(trail.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
                </td>
                <td style="border: 1px solid black; padding: 4px;">${trail.to}</td>
                <td style="border: 1px solid black; padding: 4px;">${trail.from}</td>
                <td style="border: 1px solid black; padding: 4px;">${trail.receiver}</td>
                <td style="border: 1px solid black; padding: 4px;">${trail.actionRequested}</td>
                <td style="border: 1px solid black; padding: 4px;">${trail.remarks}</td>
                <td style="border: 1px solid black; padding: 4px;">${trail.actionTaken}</td>
              </tr>
            `
      )
      .join('')}

        </tbody>
      </table>
    </div>
  `;

  return generatePDFContent();
};

export default AnnexDForm;
