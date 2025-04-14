
import React from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";

interface SubmissionStatusButtonProps {
  submissionStatus: 'none' | 'pending' | 'approved' | 'rejected';
  hasChanges: boolean;
}

const SubmissionStatusButton: React.FC<SubmissionStatusButtonProps> = ({
  submissionStatus,
  hasChanges
}) => {
  if (!submissionStatus || submissionStatus === 'none') {
    return (
      <Button className="bg-widget-blue w-full">
        <Send size={16} className="mr-2" /> Submit for Approval
      </Button>
    );
  }

  if (hasChanges) {
    return (
      <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
        <RefreshCw size={16} className="mr-2" /> Resubmit for Approval
      </Button>
    );
  }

  switch (submissionStatus) {
    case 'pending':
      return (
        <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
          <Clock size={16} className="mr-2" /> Pending Approval
        </Button>
      );
    case 'approved':
      return (
        <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
          <CheckCircle size={16} className="mr-2" /> Approved
        </Button>
      );
    case 'rejected':
      return (
        <Button variant="outline" className="border-red-500 text-red-500 w-full">
          <XCircle size={16} className="mr-2" /> Rejected
        </Button>
      );
    default:
      return (
        <Button className="bg-widget-blue w-full">
          <Send size={16} className="mr-2" /> Submit for Approval
        </Button>
      );
  }
};

export default SubmissionStatusButton;
