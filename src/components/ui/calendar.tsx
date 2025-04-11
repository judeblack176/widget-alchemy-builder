
import * as React from "react";
import { ChevronLeft, ChevronRight, Download, Upload, RefreshCw } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ICSConfig } from "@/types/widget-types";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  calendarService?: 'google' | 'outlook' | 'apple' | 'custom' | 'none';
  onSyncWithExternalCalendar?: (service: string) => void;
  icsConfig?: ICSConfig;
  onImportICS?: (file: File) => void;
  onExportICS?: () => void;
  onSubscribeICS?: (url: string) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  calendarService = 'none',
  onSyncWithExternalCalendar,
  icsConfig,
  onImportICS,
  onExportICS,
  onSubscribeICS,
  ...props
}: CalendarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImportICS) {
      onImportICS(e.target.files[0]);
    }
  };

  const handleExportClick = () => {
    if (onExportICS) {
      onExportICS();
    }
  };

  const renderICSTools = () => {
    if (!icsConfig?.enabled) return null;

    return (
      <div className="flex items-center justify-end space-x-1 mt-1">
        {icsConfig.importEnabled && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept=".ics"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              title="Import ICS file"
            >
              <Upload className="h-3 w-3 mr-1" />
              Import
            </button>
          </>
        )}
        
        {icsConfig.exportEnabled && (
          <button
            onClick={handleExportClick}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            title="Export as ICS file"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </button>
        )}
        
        {icsConfig.allowSubscribe && icsConfig.icsUrl && (
          <button
            onClick={() => onSubscribeICS && onSubscribeICS(icsConfig.icsUrl || '')}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            title="Subscribe to calendar"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Subscribe
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3 pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
      {renderICSTools()}
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
