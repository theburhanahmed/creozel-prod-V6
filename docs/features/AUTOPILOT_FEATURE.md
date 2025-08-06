# Autopilot - AI Content Repurposing

## Overview
The Autopilot feature allows users to automatically repurpose their content across multiple social media platforms with AI assistance. It generates platform-optimized versions of the original content while maintaining the core message and intent.

## Components

### 1. RepurposeModal (`components/autopilot/RepurposeModal.tsx`)
A modal component that allows users to configure how they want to repurpose their content.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `contentId: string` - ID of the content to repurpose
- `originalContent: string` - The original content text
- `onRepurpose: (config: IRepurposeConfig) => Promise<void>` - Callback when repurposing is initiated

### 2. useRepurpose Hook (`hooks/useRepurpose.ts`)
A custom hook that handles the repurposing logic and state management.

**Return Value:**
```typescript
{
  repurpose: (contentId: string, config: IRepurposeConfig) => Promise<void>;
  isRepurposing: boolean;
  error: Error | null;
}
```

### 3. API Route (`pages/api/repurpose.ts`)
Handles the server-side logic for content repurposing, including authentication and error handling.

### 4. Supabase Edge Function (`supabase/functions/repurpose-content`)
Processes the content repurposing request and generates platform-specific versions.

## Setup

### Environment Variables
Add these to your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Dependencies
Make sure these dependencies are installed:
```bash
npm install @supabase/supabase-js @testing-library/react-hooks @testing-library/jest-dom
```

## Usage Example

```tsx
import { useState } from 'react';
import { RepurposeModal } from '../components/autopilot/RepurposeModal';
import { useRepurpose } from '../hooks/useRepurpose';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { repurpose, isRepurposing } = useRepurpose();

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Repurpose Content</button>
      
      <RepurposeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentId="content-123"
        originalContent="Your original content here..."
        onRepurpose={async (config) => {
          await repurpose('content-123', config);
          // Handle success
        }}
      />
    </>
  );
};
```

## Testing

### Unit Tests
Run the test suite with:
```bash
npm test
```

### Test Coverage
To generate a coverage report:
```bash
npm test -- --coverage
```

## Error Handling
The component and hook include comprehensive error handling for:
- Network errors
- Authentication failures
- Invalid input
- API rate limiting

## Performance Considerations
- The modal is lazy-loaded to reduce initial bundle size
- API responses are cached where appropriate
- The component is memoized to prevent unnecessary re-renders

## Future Improvements
- Add support for more content types (images, videos)
- Implement content scheduling
- Add preview functionality for repurposed content
- Support for custom templates

## Related Documentation
- [Supabase Functions](https://supabase.com/docs/guides/functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
