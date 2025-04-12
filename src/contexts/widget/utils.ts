
export const processApiResponse = (obj: any, prefix = ''): string[] => {
  if (!obj || typeof obj !== 'object') return [];
  
  let paths: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const newPath = prefix ? `${prefix}.${key}` : key;
    paths.push(newPath);
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      paths = [...paths, ...processApiResponse(value, newPath)];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      paths.push(`${newPath}[0]`);
      paths = [...paths, ...processApiResponse(value[0], `${newPath}[0]`)];
    }
  });
  
  return paths;
};

export const loadWidgetFromId = (widgetId: string | null) => {
  if (!widgetId) return null;
  
  try {
    const savedSubmissions = localStorage.getItem('widgetSubmissions');
    if (savedSubmissions) {
      const submissions = JSON.parse(savedSubmissions);
      return submissions.find((s: any) => s.id === widgetId) || null;
    }
  } catch (error) {
    console.error("Failed to load widget from ID", error);
  }
  
  return null;
};

export const loadSavedData = () => {
  try {
    const data: any = {};
    
    const savedApiTemplates = localStorage.getItem('savedApiTemplates');
    if (savedApiTemplates) {
      data.savedApiTemplates = JSON.parse(savedApiTemplates);
    }
    
    const savedTooltips = localStorage.getItem('savedTooltips');
    if (savedTooltips) {
      data.tooltips = JSON.parse(savedTooltips);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to load saved data", error);
    return {};
  }
};
