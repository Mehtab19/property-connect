/**
 * Excel Parser Utility
 * Handles reading and parsing Excel files containing property data
 * Uses the xlsx library for client-side Excel parsing
 */

import * as XLSX from 'xlsx';
import { Property } from '@/data/propertyData';

// Excel column mapping - maps Excel column headers to Property fields
interface ExcelPropertyRow {
  'Property ID'?: string;
  'Name'?: string;
  'Title'?: string;
  'Price'?: string;
  'Location'?: string;
  'City'?: string;
  'Country'?: string;
  'Address'?: string;
  'Area'?: string;
  'Bedrooms'?: number;
  'Bathrooms'?: number;
  'Parking'?: number;
  'Type'?: string;
  'Status'?: string;
  'Description'?: string;
  'Features'?: string;
  'Developer'?: string;
  'Image_URL'?: string;
  'AI_Score'?: number;
  'Expected_ROI'?: string;
  'Completion_Months'?: number;
  'Agent_Name'?: string;
  'Agent_Phone'?: string;
  'Agent_Email'?: string;
  'Agent_WhatsApp'?: string;
  'Electricity'?: string;
  'Water'?: string;
  'Gas'?: string;
  'Security'?: string;
  'Internet'?: string;
  'Backup_Power'?: string;
  'Ownership_Status'?: string;
  'Approval_Authority'?: string;
  'Possession_Status'?: string;
}

/**
 * Parse an Excel file and convert it to an array of Property objects
 * @param file - The Excel file to parse
 * @returns Promise<Property[]> - Array of parsed properties
 */
export const parseExcelFile = async (file: File): Promise<Property[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData: ExcelPropertyRow[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Map Excel data to Property objects
        const properties: Property[] = jsonData.map((row, index) => {
          // Parse features from comma-separated string
          const features = row['Features'] 
            ? row['Features'].split(',').map(f => f.trim())
            : [];
          
          // Determine property type
          const typeMap: Record<string, Property['type']> = {
            'residential': 'residential',
            'commercial': 'commercial',
            'luxury': 'luxury',
            'construction': 'construction',
            'under construction': 'construction'
          };
          const rawType = (row['Type'] || 'residential').toLowerCase();
          const type = typeMap[rawType] || 'residential';

          return {
            id: row['Property ID'] || String(index + 1),
            name: row['Name'] || 'Unnamed Property',
            title: row['Title'] || row['Name'] || 'Property',
            price: row['Price'] || 'Price on Request',
            location: row['Location'] || 'Unknown',
            city: row['City'] || '',
            country: row['Country'] || '',
            address: row['Address'] || '',
            area: row['Area'] || 'N/A',
            bedrooms: Number(row['Bedrooms']) || 0,
            bathrooms: Number(row['Bathrooms']) || 0,
            parking: Number(row['Parking']) || 0,
            type,
            status: row['Status'] || 'Available',
            description: row['Description'] || '',
            features,
            amenities: {
              electricity: row['Electricity']?.toLowerCase() === 'yes',
              water: row['Water']?.toLowerCase() === 'yes',
              gas: row['Gas']?.toLowerCase() === 'yes',
              security: row['Security']?.toLowerCase() === 'yes',
              internet: row['Internet']?.toLowerCase() === 'yes',
              backupPower: row['Backup_Power']?.toLowerCase() === 'yes'
            },
            legalInfo: {
              ownershipStatus: row['Ownership_Status'] || 'N/A',
              approvalAuthority: row['Approval_Authority'] || 'N/A',
              possessionStatus: row['Possession_Status'] || 'N/A'
            },
            agent: {
              name: row['Agent_Name'] || 'Contact Us',
              phone: row['Agent_Phone'] || '',
              email: row['Agent_Email'] || 'info@primexestates.com',
              whatsapp: row['Agent_WhatsApp'] || ''
            },
            developer: row['Developer'] || 'Unknown Developer',
            imageUrl: row['Image_URL'] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            gallery: [row['Image_URL'] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
            aiScore: Number(row['AI_Score']) || 8.0,
            expectedRoi: row['Expected_ROI'] || '10%',
            completionMonths: Number(row['Completion_Months']) || 0
          };
        });

        resolve(properties);
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please ensure the file format is correct.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Validate that the Excel file has the required columns
 * @param file - The Excel file to validate
 * @returns Promise<boolean> - True if valid, throws error if not
 */
export const validateExcelFile = async (file: File): Promise<boolean> => {
  const requiredColumns = ['Name', 'Price', 'Location'];
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty.'));
          return;
        }

        const headers = Object.keys(jsonData[0] as object);
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`));
          return;
        }

        resolve(true);
      } catch (error) {
        reject(new Error('Failed to validate Excel file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsBinaryString(file);
  });
};
