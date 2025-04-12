
import React from 'react';
import { WidgetComponent } from '@/types';
import { Calendar, Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from './icons';

interface CalendarRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const CalendarRenderer: React.FC<CalendarRendererProps> = ({ component, finalProps }) => {
  return (
    <div className="space-y-2">
      {finalProps.label && (
        <label className="block text-sm font-medium">{finalProps.label}</label>
      )}
      
      {finalProps.calendarType === 'date-picker' ? (
        <div className="border rounded p-4">
          <CalendarComponent
            mode="single"
            className="rounded-md border"
          />
        </div>
      ) : (
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <h3 className="font-medium">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-1">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3 + 1; // Adjust to start from Monday of the first week
              return (
                <div 
                  key={i} 
                  className={`text-center text-sm p-2 rounded-full ${
                    day > 0 && day <= 30 ? "hover:bg-gray-100 cursor-pointer" : "opacity-0"
                  } ${day === 15 ? "bg-blue-100 text-blue-700" : ""}`}
                >
                  {day > 0 && day <= 30 ? day : ""}
                </div>
              );
            })}
          </div>
          
          {finalProps.calendarProvider && finalProps.calendarProvider !== 'none' && (
            <div className="mt-3 text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Connected to {finalProps.calendarProvider} Calendar
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarRenderer;
