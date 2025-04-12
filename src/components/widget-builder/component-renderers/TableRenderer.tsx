
import React from 'react';
import { WidgetComponent, TableColumn } from '@/types/widget-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Search, FileText } from 'lucide-react';
import { ArrowUpDown } from './icons';

interface TableRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const TableRenderer: React.FC<TableRendererProps> = ({ component, finalProps }) => {
  const isPaginated = finalProps.pagination === true;
  const isSearchable = finalProps.searchable === true;
  const isSortable = finalProps.sortable === true;
  const isExportable = finalProps.exportable === true;
  
  return (
    <Card>
      <CardContent className="p-0">
        {(isSearchable || isExportable) && (
          <div className="p-3 border-b flex justify-between items-center">
            {isSearchable && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  className="pl-9 pr-4 py-1 w-full border rounded text-sm"
                  placeholder="Search..."
                />
              </div>
            )}
            {isExportable && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText size={16} className="mr-1" />
                  Export
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="border rounded overflow-hidden" style={{ borderColor: finalProps.borderColor || '#E2E8F0' }}>
          <Table>
            <thead style={{ 
              backgroundColor: finalProps.headerBackgroundColor || '#F8FAFC',
              color: finalProps.headerTextColor || '#334155' 
            }}>
              <tr>
                {Array.isArray(finalProps.columns) ? 
                  finalProps.columns.map((column: TableColumn, index: number) => (
                    <th key={index} className="p-2 text-left">
                      <div className="flex items-center">
                        {column.header}
                        {isSortable && (
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <ArrowUpDown size={14} />
                          </button>
                        )}
                      </div>
                    </th>
                  )) : 
                  (
                    <>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Age</th>
                      <th className="p-2 text-left">Status</th>
                    </>
                  )
                }
              </tr>
            </thead>
            <tbody>
              {Array.isArray(finalProps.data) ? 
                finalProps.data.map((row: any, rowIndex: number) => (
                  <tr 
                    key={rowIndex}
                    style={{ 
                      backgroundColor: finalProps.striped && rowIndex % 2 !== 0 ? 
                        (finalProps.altRowBackgroundColor || '#F1F5F9') : 
                        (finalProps.rowBackgroundColor || '#FFFFFF'),
                      color: finalProps.rowTextColor || '#1E293B'
                    }}
                    className={finalProps.hoverable ? 'hover:bg-gray-50' : ''}
                  >
                    {Array.isArray(finalProps.columns) && finalProps.columns.map((column: TableColumn, colIndex: number) => (
                      <td key={colIndex} className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>
                        {row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                )) : 
                (
                  <>
                    <tr className={finalProps.hoverable ? 'hover:bg-gray-50' : ''}>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>John Doe</td>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>28</td>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Active</td>
                    </tr>
                    <tr className={`${finalProps.striped ? 'bg-gray-50' : ''} ${finalProps.hoverable ? 'hover:bg-gray-100' : ''}`}>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Jane Smith</td>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>32</td>
                      <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Inactive</td>
                    </tr>
                  </>
                )
              }
            </tbody>
          </Table>
        </div>
        
        {isPaginated && (
          <div className="p-3 border-t flex justify-between items-center text-sm">
            <div>
              Showing 1-{finalProps.pageSize || 10} of 100 items
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-gray-100">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableRenderer;
