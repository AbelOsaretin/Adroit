// @ts-nocheck
import * as bizSdk from 'facebook-nodejs-business-sdk';

const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;
const AdSet = bizSdk.AdSet;
const Ad = bizSdk.Ad;
const AdCreative = bizSdk.AdCreative;
const CustomAudience = bizSdk.CustomAudience;
const AdImage = bizSdk.AdImage;
const AdVideo = bizSdk.AdVideo;

let apiInitialized = false;

export function initMetaApi(accessToken: string) {
  if (!apiInitialized) {
    bizSdk.FacebookAdsApi.init(accessToken);
    apiInitialized = true;
  }
}

export function getAdAccount(accountId: string, accessToken: string) {
  initMetaApi(accessToken);
  const formattedId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;
  return new AdAccount(formattedId);
}

export {
  AdAccount,
  Campaign,
  AdSet,
  Ad,
  AdCreative,
  CustomAudience,
  AdImage,
  AdVideo,
  bizSdk,
};
