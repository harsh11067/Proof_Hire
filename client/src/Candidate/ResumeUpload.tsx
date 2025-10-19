import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import FileUploadWithVerification from "../components/FileUploadWithVerification";
import { ArrowLeft, CheckCircle, FileText, Upload } from "lucide-react";

export default function ResumeUpload() {
  const { user } = usePrivy();
  const navigate = useNavigate();
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleVerificationComplete = (result: any) => {
    console.log("Verification complete:", result);
    setVerificationComplete(true);
  };

  const handleContinueToApplications = () => {
    navigate("/candidate/apply");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/candidate")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Get verified credentials and start applying to jobs with confidence
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <span className="ml-2 font-medium text-blue-600">Upload Resume</span>
            </div>
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                verificationComplete ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-4 h-4 ${
                  verificationComplete ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <span className={`ml-2 font-medium ${
                verificationComplete ? 'text-green-600' : 'text-gray-400'
              }`}>
                Get Verified
              </span>
            </div>
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <span className="ml-2 font-medium text-gray-400">Apply to Jobs</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Your PDF Resume
            </h2>
            <p className="text-gray-600">
              Upload your resume to get verified credentials and start applying to jobs
            </p>
          </div>

          <FileUploadWithVerification
            onVerificationComplete={handleVerificationComplete}
          />

          {/* Success Message */}
          {verificationComplete && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-800">
                  Resume Verified Successfully!
                </h3>
              </div>
              <p className="text-green-700 mb-4">
                Your resume has been verified and you now have verified credentials. 
                You can now apply to jobs with confidence.
              </p>
              <button
                onClick={handleContinueToApplications}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue to Job Applications
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Why Upload Your Resume?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Get verified credentials that prove your qualifications</li>
            <li>• Apply to jobs with confidence knowing your resume is verified</li>
            <li>• Stand out to employers with verified credentials</li>
            <li>• Secure and decentralized verification process</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
