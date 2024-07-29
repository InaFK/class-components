import { saveAs } from 'file-saver';

export const downloadCSV = (items: { name: string; description: string }[]) => {
  const csvContent = `data:text/csv;charset=utf-8,${items
    .map((item) => `${item.name},${item.description}`)
    .join('\n')}`;
  
  const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
    type: 'text/csv;charset=utf-8;',
  });

  saveAs(blob, `${items.length}_items.csv`);
};
