import { getAdAccount, AdCreative, AdImage, AdVideo } from '../sdk';

export const getAdCreativesTool = {
  name: 'meta-get-ad-creatives',
  description: 'Get all ad creatives from an account',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      limit: { type: 'number', description: 'Max creatives to return', default: 25 },
    },
    required: ['accountId'],
  },
};

export const createAdCreativeTool = {
  name: 'meta-create-ad-creative',
  description: 'Create a new ad creative with image or video',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Creative name' },
      title: { type: 'string', description: 'Ad headline/title' },
      body: { type: 'string', description: 'Ad body text' },
      imageUrl: { type: 'string', description: 'Image URL or hash' },
      videoId: { type: 'string', description: 'Video ID (if using video)' },
      linkUrl: { type: 'string', description: 'Destination URL' },
      callToAction: { type: 'string', description: 'CTA type: SHOP_NOW, LEARN_MORE, SIGN_UP, CONTACT_US, DOWNLOAD' },
      pageId: { type: 'string', description: 'Facebook Page ID' },
    },
    required: ['accountId', 'name', 'body', 'linkUrl'],
  },
};

export const createAdCreativeFromPostTool = {
  name: 'meta-create-creative-from-post',
  description: 'Create an ad creative from an existing page post',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      name: { type: 'string', description: 'Creative name' },
      postId: { type: 'string', description: 'Page post ID' },
      pageId: { type: 'string', description: 'Facebook Page ID' },
    },
    required: ['accountId', 'name', 'postId', 'pageId'],
  },
};

export const deleteAdCreativeTool = {
  name: 'meta-delete-ad-creative',
  description: 'Delete an ad creative',
  inputSchema: {
    type: 'object' as const,
    properties: {
      creativeId: { type: 'string', description: 'Ad Creative ID to delete' },
    },
    required: ['creativeId'],
  },
};

export const uploadAdImageTool = {
  name: 'meta-upload-ad-image',
  description: 'Upload an image for ad creatives',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      imageUrl: { type: 'string', description: 'Image URL to upload' },
      filename: { type: 'string', description: 'Filename for the image' },
    },
    required: ['accountId', 'imageUrl'],
  },
};

export const uploadAdVideoTool = {
  name: 'meta-upload-ad-video',
  description: 'Upload a video for ad creatives',
  inputSchema: {
    type: 'object' as const,
    properties: {
      accountId: { type: 'string', description: 'Meta Ad Account ID' },
      videoUrl: { type: 'string', description: 'Video URL to upload' },
      title: { type: 'string', description: 'Video title' },
      description: { type: 'string', description: 'Video description' },
    },
    required: ['accountId', 'videoUrl'],
  },
};

// Execute functions
export async function executeGetAdCreatives(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const creatives = await account.getAdCreatives(['name', 'title', 'body', 'image_url', 'video_id', 'link_url', 'object_story_spec'], { limit: args.limit || 25 });
  return creatives.map((c: any) => c.exportAll());
}

export async function executeCreateAdCreative(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    object_story_spec: {
      link_data: {
        image_hash: args.imageUrl,
        link: args.linkUrl,
        message: args.body,
        name: args.title,
      },
      page_id: args.pageId,
    },
  };
  if (args.callToAction) {
    params.object_story_spec.link_data.call_to_action = {
      type: args.callToAction.toUpperCase(),
      value: { link: args.linkUrl },
    };
  }
  const creative = await account.createAdCreative([], params);
  return creative.exportAll();
}

export async function executeCreateAdCreativeFromPost(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const params: any = {
    name: args.name,
    object_story_spec: {
      page_id: args.pageId,
      post_data: {
        post_id: args.postId,
      },
    },
  };
  const creative = await account.createAdCreative([], params);
  return creative.exportAll();
}

export async function executeDeleteAdCreative(args: any, accessToken: string) {
  const creative = new AdCreative(args.creativeId);
  await creative.delete();
  return { success: true, deleted: args.creativeId };
}

export async function executeUploadAdImage(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const image = await account.createAdImage([], {
    filename: args.filename || 'ad_image.jpg',
    url: args.imageUrl,
  });
  return image.exportAll();
}

export async function executeUploadAdVideo(args: any, accessToken: string) {
  const account = getAdAccount(args.accountId, accessToken);
  const video = await account.createAdVideo([], {
    file_url: args.videoUrl,
    title: args.title,
    description: args.description,
  });
  return video.exportAll();
}
