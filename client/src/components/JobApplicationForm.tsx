import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePrivy } from "@privy-io/react-auth";
import { verifyApplicantCredentials } from "../../scripts/issuePdfCredential";
import { CheckCircle, AlertCircle, User, Mail, FileText } from "lucide-react";

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  experience: z.string().min(1, "Experience level is required"),
  skills: z.string().min(10, "Please describe your skills"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobApplicationFormProps {
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
  onApplied?: (data: any) => void;
}

export default function JobApplicationForm({ 
  applicationId, 
  jobTitle = "Position", 
  companyName,
  onApplied 
}: JobApplicationFormProps) {
  const { user } = usePrivy();
  const { register, handleSubmit, control, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      experience: "",
      skills: "",
      coverLetter: "",
    },
  });

  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"checking" | "verified" | "failed" | "idle">("idle");

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      setMessage("Please log in to submit your application");
      return;
    }

    setSubmitting(true);
    setMessage("Checking verification...");
    setVerificationStatus("checking");

    try {
      // First ensure applicant uploaded & got a VC (agent expects a verified credential)
      const verification = await verifyApplicantCredentials(applicationId ?? user.id);

      if (!verification || !verification.verified) {
        setMessage("❌ You must have a verified credential to apply. Please upload & get verified with Moca first.");
        setVerificationStatus("failed");
        setSubmitting(false);
        return;
      }

      setVerificationStatus("verified");
      setMessage("✅ Verification successful. Submitting application...");

      // Submit the application to your existing endpoint if verification passed
      const applicationData = {
        ...data,
        userId: user.id,
        userAddress: user.wallet?.address,
        applicationId,
        jobTitle,
        companyName,
        verification,
        submittedAt: new Date().toISOString(),
      };

      const resp = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || "Application submit failed");
      }

      const result = await resp.json();
      setMessage("✅ Application submitted successfully!");
      
      // Call completion callback
      if (onApplied) {
        onApplied(result);
      }

    } catch (err: any) {
      console.error(err);
      setMessage("❌ Error: " + (err?.message ?? err));
      setVerificationStatus("failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Apply for {jobTitle}
        </h2>
        {companyName && (
          <p className="text-gray-600">at {companyName}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Verification Status */}
        {verificationStatus !== "idle" && (
          <div className={`p-4 rounded-lg border ${
            verificationStatus === "verified" 
              ? "bg-green-50 border-green-200 text-green-800"
              : verificationStatus === "failed"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center">
              {verificationStatus === "verified" && <CheckCircle className="w-5 h-5 mr-2" />}
              {verificationStatus === "failed" && <AlertCircle className="w-5 h-5 mr-2" />}
              {verificationStatus === "checking" && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              )}
              <span className="font-medium">
                {verificationStatus === "verified" && "Credential Verified"}
                {verificationStatus === "failed" && "Verification Failed"}
                {verificationStatus === "checking" && "Checking Verification..."}
              </span>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <input
              {...register("fullName")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level *
            </label>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive Level (10+ years)</option>
                </select>
              )}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills & Expertise *
          </label>
          <textarea
            {...register("skills")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your technical skills, programming languages, tools, etc."
          />
          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4 inline mr-1" />
            Cover Letter *
          </label>
          <textarea
            {...register("coverLetter")}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          />
          {errors.coverLetter && (
            <p className="text-red-500 text-sm mt-1">{errors.coverLetter.message}</p>
          )}
        </div>

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || verificationStatus === "checking"}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            submitting || verificationStatus === "checking"
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
}
