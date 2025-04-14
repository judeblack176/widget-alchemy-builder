
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart3, LineChart, PieChart, AreaChart } from "lucide-react";

interface ChartTypeSelectorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  component,
  onUpdateComponent,
}) => {
  const chartType = component.props.chartType || 'bar';

  const handleChartTypeChange = (value: string) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        chartType: value,
      },
    });
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-3">
        <span className="font-medium">Chart Type</span>
      </div>
      <div className="p-4">
        <ToggleGroup 
          type="single" 
          value={chartType}
          onValueChange={(value) => {
            if (value) handleChartTypeChange(value);
          }}
          className="flex justify-center mb-2"
        >
          <ToggleGroupItem value="bar" aria-label="Bar Chart">
            <BarChart3 className="h-4 w-4 mr-1" />
            Bar
          </ToggleGroupItem>
          <ToggleGroupItem value="line" aria-label="Line Chart">
            <LineChart className="h-4 w-4 mr-1" />
            Line
          </ToggleGroupItem>
          <ToggleGroupItem value="pie" aria-label="Pie Chart">
            <PieChart className="h-4 w-4 mr-1" />
            Pie
          </ToggleGroupItem>
          <ToggleGroupItem value="area" aria-label="Area Chart">
            <AreaChart className="h-4 w-4 mr-1" />
            Area
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ChartTypeSelector;
