
// Helper function to get chart colors
export const getChartColors = (colorString?: string) => {
  const defaultColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  if (!colorString) return defaultColors;
  
  const colors = colorString.split(',').map(c => c.trim());
  return colors.length > 0 ? colors : defaultColors;
};

// Helper function to parse data from string
export const parseData = (dataString?: string) => {
  if (!dataString) return [];
  
  try {
    // Check if it's already a JSON string
    return JSON.parse(dataString);
  } catch (e) {
    // Try to parse CSV-like data
    try {
      const rows = dataString.split('\n').map(row => row.trim()).filter(Boolean);
      const headers = rows[0].split(',').map(h => h.trim());
      
      return rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const obj: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to convert to number if possible
          obj[header] = isNaN(Number(value)) ? value : Number(value);
        });
        
        return obj;
      });
    } catch (e) {
      console.error('Failed to parse chart data:', e);
      return [];
    }
  }
};

// Helper function to fetch data from URL
export const fetchDataFromUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from URL:', error);
    return null;
  }
};
