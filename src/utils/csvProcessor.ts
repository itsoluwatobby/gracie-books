/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';

export interface CSVBookData {
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  pageCount: number;
  stockQuantity: number;
  rating: number;
  genre: string[];
}

export interface CSVProcessResult {
  success: boolean;
  data: CSVBookData[];
  errors: string[];
  totalRows: number;
  validRows: number;
}

export interface CSVValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

// Expected CSV headers mapping
const CSV_HEADERS_MAP: Record<string, string> = {
  title: 'title',
  author: 'author', 
  description: 'description',
  price: 'price',
  cover_image: 'coverImage',
  coverimage: 'coverImage',
  cover_image_url: 'coverImage',
  isbn: 'isbn',
  publisher: 'publisher',
  publication_date: 'publicationDate',
  publicationdate: 'publicationDate',
  pub_date: 'publicationDate',
  page_count: 'pageCount',
  pagecount: 'pageCount',
  pages: 'pageCount',
  stock_quantity: 'stockQuantity',
  stockquantity: 'stockQuantity',
  stock: 'stockQuantity',
  quantity: 'stockQuantity',
  rating: 'rating',
  genre: 'genre',
  genres: 'genre',
  category: 'genre',
  categories: 'genre'
};

// Required fields for validation
const REQUIRED_FIELDS = ['title', 'author'];

// Field validators
const FIELD_VALIDATORS = {
  title: (value: any) => {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return 'Title is required and must be a non-empty string';
    }
    if (value.length > 200) {
      return 'Title must be less than 200 characters';
    }
    return null;
  },
  
  author: (value: any) => {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return 'Author is required and must be a non-empty string';
    }
    if (value.length > 100) {
      return 'Author must be less than 100 characters';
    }
    return null;
  },
  
  price: (value: any) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      return 'Price must be a valid positive number';
    }
    if (num > 10000) {
      return 'Price must be less than $10,000';
    }
    return null;
  },
  
  isbn: (value: any) => {
    if (!value || typeof value !== 'string') {
      return 'ISBN is required';
    }
    const cleanISBN = value.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
      return 'ISBN must be a valid 10 or 13 digit number';
    }
    return null;
  },
  
  pageCount: (value: any) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      return 'Page count must be a positive integer';
    }
    if (num > 10000) {
      return 'Page count must be less than 10,000';
    }
    return null;
  },
  
  stockQuantity: (value: any) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      return 'Stock quantity must be a non-negative integer';
    }
    return null;
  },
  
  rating: (value: any) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 5) {
      return 'Rating must be a number between 0 and 5';
    }
    return null;
  },
  
  publicationDate: (value: any) => {
    if (value === '' || value === null || value === undefined) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Publication date must be a valid date (YYYY-MM-DD format recommended)';
    }
    return null;
  }
};

export function normalizeHeaders(headers: string[]): string[] {
  return headers.map(header => {
    const normalized = header.toLowerCase().trim().replace(/\s+/g, '_');
    return CSV_HEADERS_MAP[normalized] || normalized;
  });
}

export function validateRow(row: any, rowIndex: number): CSVValidationError[] {
  const errors: CSVValidationError[] = [];
  
  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!row[field] || (typeof row[field] === 'string' && row[field].trim() === '')) {
      errors.push({
        row: rowIndex,
        field,
        message: `${field} is required`,
        value: row[field]
      });
    }
  });
  
  // Validate each field
  Object.keys(FIELD_VALIDATORS).forEach(field => {
    if (row[field] !== undefined && row[field] !== null) {
      const validator = FIELD_VALIDATORS[field as keyof typeof FIELD_VALIDATORS];
      const error = validator(row[field]);
      if (error) {
        errors.push({
          row: rowIndex,
          field,
          message: error,
          value: row[field]
        });
      }
    }
  });
  
  return errors;
}

export function transformRowData(row: any): CSVBookData {
  return {
    title: row.title?.trim() || '',
    author: row.author?.trim() || '',
    description: row.description?.trim() || '',
    price: parseFloat(row.price) || 0,
    coverImage: row.coverImage?.trim() || '',
    isbn: row.isbn?.trim() || '',
    publisher: row.publisher?.trim() || '',
    publicationDate: row.publicationDate ? new Date(row.publicationDate).toISOString().split('T')[0] : '',
    pageCount: parseInt(row.pageCount) || 0,
    stockQuantity: parseInt(row.stockQuantity) || 0,
    rating: parseFloat(row.rating) || 0,
    genre: row.genre ? row.genre.split(',').map((g: string) => g.trim()).filter(Boolean) : []
  };
}

// NEW FUNCTIONS FOR ALTERNATIVE CSV FORMAT

/**
 * Detects if the CSV data follows the alternative format (author, title with embedded pricing)
 */
export function isAlternativeFormat(data: any[]): boolean {
  if (data.length === 0) return false;
  
  const firstRow = data[0];
  const hasAuthorTitle = 'author' in firstRow && 'title' in firstRow;
  const hasEmbeddedPricing = data.some(row => 
    row.title && typeof row.title === 'string' && 
    (row.title.includes('= ') || row.title.includes('=') || row.title.includes('each'))
  );
  
  return hasAuthorTitle && hasEmbeddedPricing;
}

/**
 * Extracts price from title string (e.g., "Book Title = 4k" -> { title: "Book Title", price: 4000 })
 */

export function extractPriceFromTitle(titleStr: string): { title: string; price: number; quantity: number } {
  if (!titleStr || typeof titleStr !== 'string') {
    return { title: '', price: 0, quantity: 1 };
  }

  // First extract quantity from brackets (e.g., "(3)")
  let quantity = 1;
  const quantityMatch = titleStr.match(/\((\d+)\)/);
  if (quantityMatch) {
    quantity = parseInt(quantityMatch[1]);
  }

  // Match patterns like "= 4k", "= 3k5", "= 6k", etc.
  const priceMatch = titleStr.match(/\s*=\s*(\d+(?:\.\d+)?)k?(\d*)\s*(?:each)?/i);
  
  if (priceMatch) {
    const basePrice = parseFloat(priceMatch[1]);
    const decimal = priceMatch[2] ? parseFloat(`0.${priceMatch[2]}`) : 0;
    const totalPrice = (basePrice + decimal) * 1000; // Convert k to actual number
    
    // Remove both price and quantity from title
    let cleanTitle = titleStr.replace(/\s*=\s*\d+(?:\.\d+)?k?\d*\s*(?:each)?\s*$/i, '').trim();
    cleanTitle = cleanTitle.replace(/\s*\(\d+\)\s*/g, '').trim();
    return { title: cleanTitle, price: totalPrice, quantity };
  }

  // Handle cases where price might be in different formats
  const simplePrice = titleStr.match(/\s*=\s*(\d+(?:\.\d+)?)\s*(?:each)?$/i);
  if (simplePrice) {
    const price = parseFloat(simplePrice[1]);
    let cleanTitle = titleStr.replace(/\s*=\s*\d+(?:\.\d+)?\s*(?:each)?\s*$/i, '').trim();
    cleanTitle = cleanTitle.replace(/\s*\(\d+\)\s*/g, '').trim();
    return { title: cleanTitle, price, quantity };
  }

  // If no price found, still extract quantity and clean title
  const cleanTitle = titleStr.replace(/\s*\(\d+\)\s*/g, '').trim();
  return { title: cleanTitle, price: 0, quantity };
}

/**
 * Processes a row from the alternative CSV format and returns multiple book entries
 */
export function processAlternativeRow(row: any, rowIndex: number): { books: CSVBookData[]; errors: string[] } {
  const books: CSVBookData[] = [];
  const errors: string[] = [];

  if (!row.author || typeof row.author !== 'string') {
    errors.push(`Row ${rowIndex}: Author is missing or invalid`);
    return { books, errors };
  }

  const author = row.author.trim();
  
  // Handle author with embedded price info (e.g., "ALEXANDER McCALL SMITH 3k each")
  const authorPriceMatch = author.match(/^(.+?)\s+(\d+(?:\.\d+)?)k?\s*each$/i);
  let cleanAuthor = author;
  let authorPrice = 0;

  if (authorPriceMatch) {
    cleanAuthor = authorPriceMatch[1].trim();
    const basePrice = parseFloat(authorPriceMatch[2]);
    authorPrice = basePrice * 1000;
  }

  // Process all title columns
   const allValues = Object.keys(row)
    .filter(key => key !== 'author' && row[key] && row[key].toString().trim())
    .map(key => row[key].toString().trim())
    .filter(Boolean);

  // Join all values and split by commas to get individual titles
  const combinedText = allValues.join(',');
  const allTitles = combinedText.split(',').map(t => t.trim()).filter(Boolean);

  // Process each title
  allTitles.forEach(titleStr => {
    if (titleStr) {
      const { title, price, quantity } = extractPriceFromTitle(titleStr);
      if (title) {
        books.push({
          title,
          author: cleanAuthor,
          price: price || authorPrice,
          description: '',
          coverImage: '',
          isbn: '',
          publisher: '',
          publicationDate: '',
          pageCount: 0,
          stockQuantity: quantity,
          rating: 0,
          genre: []
        });
      }
    }
  });

  if (books.length === 0) {
    errors.push(`Row ${rowIndex}: No valid books found for author "${cleanAuthor}"`);
  }

  return { books, errors };
}

/**
 * Processes CSV data in the alternative format
 */
export function processAlternativeCSV(data: any[]): CSVProcessResult {
  const result: CSVProcessResult = {
    success: false,
    data: [],
    errors: [],
    totalRows: data.length,
    validRows: 0
  };

  const allBooks: CSVBookData[] = [];
  const allErrors: string[] = [];

  data.forEach((row, index) => {
    const { books, errors } = processAlternativeRow(row, index + 1);
    
    if (errors.length > 0) {
      allErrors.push(...errors);
    }
    
    if (books.length > 0) {
      allBooks.push(...books);
      result.validRows++;
    }
  });

  result.data = allBooks;
  result.errors = allErrors;
  result.success = allBooks.length > 0;

  return result;
}

// UPDATED MAIN PROCESS FUNCTION

export function processCSV(file: File): Promise<CSVProcessResult> {
  return new Promise((resolve) => {
    const result: CSVProcessResult = {
      success: false,
      data: [],
      errors: [],
      totalRows: 0,
      validRows: 0
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        const normalized = header.toLowerCase().trim().replace(/\s+/g, '_');
        return CSV_HEADERS_MAP[normalized] || header;
      },
      complete: (results) => {
        result.totalRows = results.data.length;
        
        if (results.errors.length > 0) {
          result.errors.push(...results.errors.map(err => `Parse error: ${err.message}`));
        }

        // Check if this is the alternative format
        if (isAlternativeFormat(results.data)) {
          const alternativeResult = processAlternativeCSV(results.data);
          resolve({
            ...alternativeResult,
            totalRows: result.totalRows
          });
          return;
        }

        // Original processing logic for standard format
        const validData: CSVBookData[] = [];
        const allErrors: string[] = [...result.errors];

        results.data.forEach((row: any, index: number) => {
          const rowErrors = validateRow(row, index + 1);
          
          if (rowErrors.length === 0) {
            try {
              const transformedRow = transformRowData(row);
              validData.push(transformedRow);
              result.validRows++;
            } catch (error) {
              allErrors.push(`Row ${index + 1}: Failed to transform data - ${error}`);
            }
          } else {
            rowErrors.forEach(error => {
              allErrors.push(`Row ${error.row}: ${error.field} - ${error.message}`);
            });
          }
        });

        result.data = validData;
        result.errors = allErrors;
        result.success = result.validRows > 0;

        resolve(result);
      },
      error: (error) => {
        result.errors.push(`File parsing failed: ${error.message}`);
        resolve(result);
      }
    });
  });
}

export function generateCSVTemplate(): string {
  const headers = [
    'title',
    'author', 
    'description',
    'price',
    'cover_image',
    'isbn',
    'publisher',
    'publication_date',
    'page_count',
    'stock_quantity',
    'rating',
    'genre'
  ];
  
  const sampleData = [
    [
      'The Great Gatsby',
      'F. Scott Fitzgerald',
      'A classic American novel set in the Jazz Age',
      '12.99',
      'https://example.com/gatsby-cover.jpg',
      '9780743273565',
      'Scribner',
      '1925-04-10',
      '180',
      '50',
      '4.2',
      'Fiction, Classic, American Literature'
    ],
    [
      '1984',
      'George Orwell',
      'A dystopian social science fiction novel',
      '13.99',
      'https://example.com/1984-cover.jpg',
      '9780451524935',
      'Secker & Warburg',
      '1949-06-08',
      '328',
      '75',
      '4.5',
      'Fiction, Dystopian, Political Fiction'
    ]
  ];
  
  const csvContent = [headers, ...sampleData]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
    
  return csvContent;
}

export function downloadCSVTemplate() {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'book_upload_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}