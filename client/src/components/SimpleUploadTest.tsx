import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function SimpleUploadTest() {
  const { user } = usePrivy();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage(null);
    } else {
      setMessage('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    if (!user) {
      setMessage('Please log in first');
      return;
    }

    setUploading(true);
    setMessage('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('fileHash', 'test-hash');

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadResult(result);
      setMessage('✅ File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Simple Upload Test
      </h2>

      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* File Info */}
        {file && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{file.name}</div>
            <div className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            !file || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2 inline" />
              Upload File
            </>
          )}
        </button>

        {/* Status Message */}
        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : message.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Upload Result:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Logged in as:</h4>
            <p className="text-sm text-blue-700">{user.id}</p>
            {user.wallet?.address && (
              <p className="text-sm text-blue-700">{user.wallet.address}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

