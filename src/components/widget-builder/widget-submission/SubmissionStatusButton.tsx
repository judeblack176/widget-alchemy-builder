
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
  // If no previous submission or never submitted
  if (!submissionStatus || submissionStatus === 'none') {
    return (
      <Button className="bg-widget-blue w-full">
        <Send size={16} className="mr-2" /> Submit Widget
      </Button>
    );
  }

  // Only show resubmit if the widget is in approval process
  if (submissionStatus === 'pending') {
    return (
      <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
        <Clock size={16} className="mr-2" /> Pending Approval
      </Button>
    );
  }

  if (submissionStatus === 'approved') {
    return (
      <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
        <CheckCircle size={16} className="mr-2" /> Approved
      </Button>
    );
  }

  if (submissionStatus === 'rejected') {
    return hasChanges ? (
      <Button className="bg-orange-500 text-white hover:bg-orange-600 w-full">
        <RefreshCw size={16} className="mr-2" /> Resubmit Widget
      </Button>
    ) : (
      <Button variant="outline" className="border-red-500 text-red-500 w-full">
        <XCircle size={16} className="mr-2" /> Rejected
      </Button>
    );
  }

  return (
    <Button className="bg-widget-blue w-full">
      <Send size={16} className="mr-2" /> Submit Widget
    </Button>
  );
};

export default SubmissionStatusButton;
