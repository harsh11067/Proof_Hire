import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import FileUploadWithVerification from "./FileUploadWithVerification";
import JobApplicationForm from "./JobApplicationForm";
import { CheckCircle, ArrowRight, FileText, User } from "lucide-react";

interface CompleteApplicationFlowProps {
  jobTitle?: string;
  companyName?: string;
  applicationId?: string;
  onApplicationComplete?: (data: any) => void;
}

export default function CompleteApplicationFlow({
  jobTitle = "Position",
  companyName,
  applicationId,
  onApplicationComplete
}: CompleteApplicationFlowProps) {
  const { user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<"upload" | "apply">("upload");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationComplete = (result: any) => {
    setVerificationResult(result);
    setIsVerified(result?.verified || false);
    
    if (result?.verified) {
      // Auto-advance to application form after successful verification
      setTimeout(() => {
        setCurrentStep("apply");
      }, 2000);
    }
  };

  const handleApplicationComplete = (data: any) => {
    if (onApplicationComplete) {
      onApplicationComplete(data);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the application system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center ${currentStep === "upload" ? "text-blue-600" : isVerified ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === "upload" ? "bg-blue-100" : isVerified ? "bg-green-100" : "bg-gray-100"
            }`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className="ml-2 font-medium">Upload & Verify</span>
          </div>
          
          <ArrowRight className={`w-6 h-6 ${isVerified ? "text-green-600" : "text-gray-400"}`} />
          
          <div className={`flex items-center ${currentStep === "apply" ? "text-blue-600" : isVerified ? "text-gray-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === "apply" ? "bg-blue-100" : isVerified ? "bg-gray-100" : "bg-gray-100"
            }`}>
              {isVerified && currentStep === "apply" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="ml-2 font-medium">Apply</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === "upload" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply for {jobTitle}
            </h1>
            {companyName && (
              <p className="text-gray-600">at {companyName}</p>
            )}
            <p className="text-gray-500 mt-4">
              First, upload your resume and get it verified with Moca credentials
            </p>
          </div>

          <FileUploadWithVerification
            onVerificationComplete={handleVerificationComplete}
            applicationId={applicationId}
          />

          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Verification successful! You can now proceed to the application form.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === "apply" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Application
            </h1>
            <p className="text-gray-600">
              Fill out the application form to submit your candidacy
            </p>
          </div>

          {verificationResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Resume verified successfully with Moca credentials
                </span>
              </div>
            </div>
          )}

          <JobApplicationForm
            applicationId={applicationId}
            jobTitle={jobTitle}
            companyName={companyName}
            onApplied={handleApplicationComplete}
          />

          <div className="text-center">
            <button
              onClick={() => setCurrentStep("upload")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


