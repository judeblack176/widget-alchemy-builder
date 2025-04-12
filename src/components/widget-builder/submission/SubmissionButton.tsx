
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

interface SubmissionButtonProps {
  status: 'none' | 'pending' | 'approved' | 'rejected';
  hasChanges: boolean;
  widgetId?: string | null;
}

const SubmissionButton: React.FC<SubmissionButtonProps> = ({ status, hasChanges, widgetId }) => {
  if (!widgetId || status === 'none') {
    return (
      <Button className="bg-widget-blue">
        <Send size={16} className="mr-2" /> Submit for Approval
      </Button>
    );
  }

  if (hasChanges) {
    return (
      <Button className="bg-orange-500 text-white hover:bg-orange-600">
        <RefreshCw size={16} className="mr-2" /> Resubmit for Approval
      </Button>
    );
  }

  switch (status) {
    case 'pending':
      return (
        <Button variant="outline" disabled className="border-amber-500 text-amber-500">
          <Clock size={16} className="mr-2" /> Pending Approval
        </Button>
      );
    case 'approved':
      return (
        <Button variant="outline" disabled className="border-green-500 text-green-500">
          <CheckCircle size={16} className="mr-2" /> Approved
        </Button>
      );
    case 'rejected':
      return (
        <Button variant="outline" disabled className="border-red-500 text-red-500">
          <XCircle size={16} className="mr-2" /> Rejected
        </Button>
      );
    default:
      return (
        <Button className="bg-widget-blue">
          <Send size={16} className="mr-2" /> Submit for Approval
        </Button>
      );
  }
};

export default SubmissionButton;
