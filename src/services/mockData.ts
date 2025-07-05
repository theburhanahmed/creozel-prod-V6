/**
 * Mock data for the media gallery
 * This simulates the data that would come from your backend API
 */
export interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  thumbnail?: string;
  modified: string;
  starred?: boolean;
  shared?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}
// Mock media items
export const mockMediaItems: MediaItem[] = [{
  id: '1',
  name: 'Product Promo.mp4',
  type: 'video',
  size: '24.5 MB',
  url: 'https://example.com/videos/product-promo.mp4',
  thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&auto=format&fit=crop&q=60',
  modified: 'Today, 10:30 AM',
  starred: true,
  shared: false,
  tags: ['marketing', 'product']
}, {
  id: '2',
  name: 'Team Photo.jpg',
  type: 'image',
  size: '3.2 MB',
  url: 'https://example.com/images/team-photo.jpg',
  thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60',
  modified: 'Yesterday',
  starred: false,
  shared: true,
  tags: ['team', 'company']
}, {
  id: '3',
  name: 'Quarterly Report.pdf',
  type: 'document',
  size: '1.8 MB',
  url: 'https://example.com/documents/quarterly-report.pdf',
  modified: 'Jul 15, 2023',
  starred: false,
  shared: false,
  tags: ['finance', 'reports']
}, {
  id: '4',
  name: 'Brand Guidelines.pdf',
  type: 'document',
  size: '4.3 MB',
  url: 'https://example.com/documents/brand-guidelines.pdf',
  modified: 'Jul 12, 2023',
  starred: true,
  shared: true,
  tags: ['brand', 'design']
}, {
  id: '5',
  name: 'Podcast Episode 12.mp3',
  type: 'audio',
  size: '18.7 MB',
  url: 'https://example.com/audio/podcast-ep12.mp3',
  modified: 'Jul 10, 2023',
  starred: false,
  shared: false,
  tags: ['podcast', 'marketing']
}, {
  id: '6',
  name: 'Website Banner.png',
  type: 'image',
  size: '2.1 MB',
  url: 'https://example.com/images/website-banner.png',
  thumbnail: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=300&auto=format&fit=crop&q=60',
  modified: 'Jul 5, 2023',
  starred: false,
  shared: false,
  tags: ['website', 'design']
}, {
  id: '7',
  name: 'Social Media Calendar.xlsx',
  type: 'document',
  size: '0.9 MB',
  url: 'https://example.com/documents/social-calendar.xlsx',
  modified: 'Jun 28, 2023',
  starred: false,
  shared: true,
  tags: ['social', 'planning']
}, {
  id: '8',
  name: 'Product Demo.mp4',
  type: 'video',
  size: '32.6 MB',
  url: 'https://example.com/videos/product-demo.mp4',
  thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=60',
  modified: 'Jun 25, 2023',
  starred: true,
  shared: false,
  tags: ['product', 'demo']
}, {
  id: '9',
  name: 'Company Logo.svg',
  type: 'image',
  size: '0.4 MB',
  url: 'https://example.com/images/company-logo.svg',
  thumbnail: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=60',
  modified: 'Jun 20, 2023',
  starred: false,
  shared: false,
  tags: ['brand', 'logo']
}, {
  id: '10',
  name: 'Customer Testimonial.mp3',
  type: 'audio',
  size: '8.2 MB',
  url: 'https://example.com/audio/testimonial.mp3',
  modified: 'Jun 15, 2023',
  starred: false,
  shared: true,
  tags: ['customer', 'marketing']
}, {
  id: '11',
  name: 'Project Proposal.docx',
  type: 'document',
  size: '1.2 MB',
  url: 'https://example.com/documents/project-proposal.docx',
  modified: 'Jun 10, 2023',
  starred: false,
  shared: false,
  tags: ['project', 'proposal']
}];
// Mock user data
export const mockUser = {
  id: 'user-1',
  name: 'Nathan Collins',
  email: 'nathan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  isAdmin: false,
  isAuthenticated: true
};
// Helper function to filter media items
export function filterMediaItems(items: MediaItem[], filters: {
  query?: string;
  type?: string[];
  tags?: string[];
  starred?: boolean;
  shared?: boolean;
}): MediaItem[] {
  return items.filter(item => {
    // Filter by search query
    if (filters.query && !item.name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    // Filter by file type
    if (filters.type && filters.type.length > 0 && !filters.type.includes(item.type)) {
      return false;
    }
    // Filter by starred status
    if (filters.starred !== undefined && item.starred !== filters.starred) {
      return false;
    }
    // Filter by shared status
    if (filters.shared !== undefined && item.shared !== filters.shared) {
      return false;
    }
    // Filter by tags (if implemented)
    if (filters.tags && filters.tags.length > 0) {
      if (!item.tags) return false;
      return filters.tags.some(tag => item.tags?.includes(tag));
    }
    return true;
  });
}