/**
 * Share utility functions for social media sharing
 */

export type SocialPlatform = 'facebook' | 'twitter' | 'whatsapp' | 'instagram';

export interface ShareContent {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
}

/**
 * Generate a share URL for a specific social media platform
 */
export function generateShareUrl(platform: SocialPlatform, content: ShareContent): string {
  const { url, title, description, hashtags = [] } = content;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const hashtagString = hashtags.join(',');

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`;
    
    case 'whatsapp': {
      const whatsappText = formatShareText(content);
      return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    }
    
    case 'instagram':
      // Instagram doesn't support direct URL sharing, return the URL for manual sharing
      return url;
    
    default:
      return url;
  }
}

/**
 * Format share text with title, description, URL, and hashtags
 */
export function formatShareText(content: ShareContent): string {
  const { url, title, description, hashtags = [] } = content;
  const parts: string[] = [title];
  
  if (description) {
    parts.push(description);
  }
  
  parts.push(url);
  
  if (hashtags.length > 0) {
    parts.push(`#${hashtags.join(' #')}`);
  }
  
  return parts.join('\n\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get default carnival hashtags
 */
export function getDefaultCarnivalHashtags(): string[] {
  return ['CalabarCarnival', 'CalabarCarnival2025', 'CarnivalXperience'];
}

/**
 * Generate share content for an event
 */
export function generateEventShareContent(event: {
  id: string;
  name: string;
  date: Date;
  imageUrl?: string;
}): ShareContent {
  const url = `/events/${event.id}`;
  const dateStr = event.date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return {
    url,
    title: event.name,
    description: `Join us for ${event.name} on ${dateStr} at Calabar Carnival 2025!`,
    image: event.imageUrl,
    hashtags: getDefaultCarnivalHashtags(),
  };
}

/**
 * Generate share content for a photo
 */
export function generatePhotoShareContent(photo: {
  id: string;
  url: string;
  caption?: string;
  photographer?: string;
}): ShareContent {
  const shareUrl = `/gallery?photo=${photo.id}`;
  const title = photo.caption || 'Amazing moment from Calabar Carnival 2025';
  const attribution = photo.photographer 
    ? `📸 Photo by ${photo.photographer}` 
    : '';
  
  return {
    url: shareUrl,
    title,
    description: attribution,
    image: photo.url,
    hashtags: getDefaultCarnivalHashtags(),
  };
}

/**
 * Generate share content for a band
 */
export function generateBandShareContent(band: {
  id: string;
  name: string;
  theme?: string;
  imageUrl?: string;
}): ShareContent {
  const url = `/bands?band=${band.id}`;
  const description = band.theme 
    ? `Check out ${band.name} with their theme "${band.theme}" at Calabar Carnival 2025!`
    : `Support ${band.name} at Calabar Carnival 2025!`;
  
  return {
    url,
    title: `Vote for ${band.name}`,
    description,
    image: band.imageUrl,
    hashtags: [...getDefaultCarnivalHashtags(), band.name.replace(/\s+/g, '')],
  };
}

/**
 * Check if native sharing is supported
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Share using native share API if available
 */
export async function nativeShare(content: ShareContent): Promise<boolean> {
  if (!isNativeShareSupported()) {
    return false;
  }
  
  try {
    await navigator.share({
      title: content.title,
      text: content.description,
      url: content.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Native share failed:', error);
    return false;
  }
}
