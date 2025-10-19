declare module "../../scripts/issuePdfCredential" {
  export function verifyApplicantCredentials(applicationId: string): Promise<any>;
  export function callAirVerifyAPI(applicationId: string): Promise<any>;
}



