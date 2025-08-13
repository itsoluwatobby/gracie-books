/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Eye, XCircle, AlertTriangle } from 'lucide-react';
import { processCSV, downloadCSVTemplate, CSVProcessResult } from '../../utils/csvProcessor';
import Button from './Button';

interface CSVUploaderProps {
  onDataProcessed: (data: any[]) => void;
  onClose: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataProcessed, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CSVProcessResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const processResult = await processCSV(file);
      setResult(processResult);
    } catch (error) {
      setResult({
        success: false,
        data: [],
        errors: [`Failed to process file: ${error}`],
        totalRows: 0,
        validRows: 0
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleImport = () => {
    if (result && result.success) {
      onDataProcessed(result.data);
      onClose();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">CSV Book Processor</h2>
                <p className="text-green-100 text-sm">
                  Upload a CSV file to import multiple books at once
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Template Download */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Download Template</h3>
                  <p className="text-sm text-blue-700">
                    Get the CSV template with sample data and required format
                  </p>
                </div>
              </div>
              <Button
                onClick={downloadCSVTemplate}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-gray-500">Supports multiple CSV formats including embedded pricing</p>
                <Button onClick={openFileDialog} className="mx-auto flex items-center gap-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          {/* Processing State */}
          {processing && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <span className="text-yellow-800 font-medium">Processing your CSV file...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-6">
              <div className={`border rounded-lg p-4 ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Processing Summary' : 'Processing Failed'}
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-gray-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{result.totalRows}</p>
                        <p className="text-sm text-gray-500">Total Rows</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">{result.data.length}</p>
                        <p className="text-sm text-gray-500">Books Processed</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center">
                      {result.errors.length > 0 ? (
                        <XCircle className="h-8 w-8 text-red-500 mr-3" />
                      ) : (
                        <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                      )}
                      <div>
                        <p className={`text-2xl font-bold ${result.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.errors.length}
                        </p>
                        <p className="text-sm text-gray-500">Errors</p>
                      </div>
                    </div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="bg-white border border-red-200 rounded p-3 mb-4">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                      <h3 className="text-base font-semibold text-red-900">Errors Found</h3>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <div key={index} className="bg-white border border-red-200 rounded p-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.success && result.validRows > 0 && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowPreview(!showPreview)}
                      variant="outline"
                      className="flex-1 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Hide Preview' : 'Preview Data'}
                    </Button>
                    <Button
                      onClick={handleImport}
                      className="flex-1 flex items-center bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Import {result.validRows} Books
                    </Button>
                  </div>
                )}
              </div>

              {/* Data Preview */}
              {showPreview && result.success && result.data.length > 0 && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Processed Books Preview (First 10 rows)</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.data.slice(0, 10).map((book, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {book.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₦{book.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.stockQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.genre.join(', ') || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {result.data.length > 10 && (
                    <div className="px-6 py-4 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-500">
                        Showing first 10 of {result.data.length} books. Download full results to see all data.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;