// TypeScript declarations for issuePdfCredential.js

export declare function generateFileHash(file: File): Promise<string>;
export declare function issuePdfVC(pdfHash: string, filename: string, applicantDid?: string): Promise<any>;
export declare function verifyApplicantCredentials(applicationId?: string): Promise<any>;
export declare function callAirVerifyAPI(applicationId: string): Promise<any>;