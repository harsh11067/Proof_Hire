import { useState } from "react";
import CompleteApplicationFlow from "./CompleteApplicationFlow";
import FileUploadWithVerification from "./FileUploadWithVerification";
import JobApplicationForm from "./JobApplicationForm";
import SimpleUploadTest from "./SimpleUploadTest";
import DebugInfo from "./DebugInfo";

export default function TestApplicationPage() {
  const [selectedComponent, setSelectedComponent] = useState<"complete" | "upload" | "form" | "simple" | "debug">("complete");
  const [applicationData, setApplicationData] = useState<any>(null);

  const handleApplicationComplete = (data: any) => {
    setApplicationData(data);
    console.log("Application completed:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ProofHire Application System Test</h1>
          
          {/* Component Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedComponent("complete")}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComponent === "complete"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Complete Flow
            </button>
            <button
              onClick={() => setSelectedComponent("upload")}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComponent === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Upload Only
            </button>
            <button
              onClick={() => setSelectedComponent("form")}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComponent === "form"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Form Only
            </button>
            <button
              onClick={() => setSelectedComponent("simple")}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComponent === "simple"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Simple Upload
            </button>
            <button
              onClick={() => setSelectedComponent("debug")}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedComponent === "debug"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Debug Info
            </button>
          </div>

          {/* Application Data Display */}
          {applicationData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">Application Submitted Successfully!</h3>
              <pre className="text-sm text-green-700 overflow-auto max-h-32">
                {JSON.stringify(applicationData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Component Display */}
        <div className="bg-white rounded-lg shadow-lg">
          {selectedComponent === "complete" && (
            <CompleteApplicationFlow
              jobTitle="Senior Software Engineer"
              companyName="TechCorp Inc."
              onApplicationComplete={handleApplicationComplete}
            />
          )}

          {selectedComponent === "upload" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">File Upload & Verification Test</h2>
              <FileUploadWithVerification
                onVerificationComplete={(result) => {
                  console.log("Verification result:", result);
                }}
              />
            </div>
          )}

          {selectedComponent === "form" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Application Form Test</h2>
              <JobApplicationForm
                jobTitle="Senior Software Engineer"
                companyName="TechCorp Inc."
                onApplied={handleApplicationComplete}
              />
            </div>
          )}

          {selectedComponent === "simple" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Simple Upload Test</h2>
              <SimpleUploadTest />
            </div>
          )}

          {selectedComponent === "debug" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Debug Information</h2>
              <DebugInfo />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-800 mb-2">Test Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Complete Flow:</strong> Test the full application process from upload to submission</li>
            <li>• <strong>Upload Only:</strong> Test just the file upload and verification functionality</li>
            <li>• <strong>Form Only:</strong> Test just the application form (requires pre-verification)</li>
            <li>• <strong>Simple Upload:</strong> Basic file upload test without Moca integration</li>
            <li>• <strong>Debug Info:</strong> Check authentication and environment status</li>
            <li>• Make sure you're logged in with Privy before testing</li>
            <li>• For Moca integration, ensure your environment variables are configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

