declare module "facebook-nodejs-business-sdk" {
  export const FacebookAdsApi: {
    init(accessToken: string): any;
  };

  export const AdAccount: any;
  export const Campaign: any;
  export const Ad: any;
  export const AdSet: any;
}
