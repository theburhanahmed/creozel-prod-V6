# Creozel Development Rules & Standards

**Version:** 1.0  
**Last Updated:** July 30, 2025  
**Status:** Mandatory for all team members

## Table of Contents

1. [Project Structure](#project-structure)
2. [Code Standards](#code-standards)  
3. [Git Workflow](#git-workflow)
4. [API Development](#api-development)
5. [Architecture Guidelines](#architecture-guidelines)
6. [Testing Standards](#testing-standards)
7. [Security Requirements](#security-requirements)
8. [Documentation Rules](#documentation-rules)
9. [Performance Standards](#performance-standards)
10. [Team Collaboration](#team-collaboration)

---

## Project Structure

### Root Directory Structure
\`\`\`
creozel/
├── .github/                 # GitHub workflows and templates
├── .vscode/                 # VS Code/Windsurf settings
├── apps/                    # Application modules
│   ├── web/                 # Frontend application
│   ├── api/                 # Backend API
│   └── admin/               # Admin dashboard
├── packages/                # Shared packages
│   ├── ui/                  # Shared UI components
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   └── config/              # Configuration files
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
├── tests/                   # E2E and integration tests
├── .env.example            # Environment variables template
├── docker-compose.yml      # Local development setup
├── package.json            # Root package.json
├── turbo.json             # Turborepo configuration
└── README.md              # Project overview
\`\`\`

### Application Structure (Feature-Based)
\`\`\`
apps/web/src/
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   └── forms/             # Form components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API calls
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── dashboard/         # Dashboard feature
│   └── content/           # Content management
├── shared/                # Shared resources
│   ├── hooks/             # Global hooks
│   ├── services/          # Global services
│   ├── utils/             # Global utilities
│   └── constants/         # Constants
├── assets/                # Static assets
├── styles/                # Global styles
└── app.tsx               # Application entry point
\`\`\`

### Naming Conventions
- **Files**: kebab-case (`user-profile.component.tsx`)
- **Directories**: kebab-case (`user-management/`)
- **Components**: PascalCase (`UserProfile`)
- **Variables/Functions**: camelCase (`getUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase with descriptive prefix (`IUserProfile`, `TApiResponse`)

---

## Code Standards

### TypeScript Rules (MANDATORY)
\`\`\`typescript
// ✅ GOOD: Explicit types
interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ BAD: Any types
const getUserProfile = async (userId: any): Promise<any> => {
  // Implementation
};
\`\`\`

### Code Quality Standards
1. **No `any` types** - Use proper TypeScript types
2. **No `console.log`** in production code - Use proper logging
3. **No inline styles** - Use CSS modules or styled-components
4. **No hardcoded values** - Use constants/environment variables
5. **Maximum function length**: 50 lines
6. **Maximum file length**: 300 lines
7. **Cyclomatic complexity**: Maximum 10

### ESLint Configuration (Mandatory Rules)
\`\`\`json
{
  "extends": [
    "@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "error",
    "complexity": ["error", 10]
  }
}
\`\`\`

### Component Standards
\`\`\`typescript
// ✅ GOOD: Proper component structure
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  className = '' 
}) => {
  const handleEdit = useCallback(() => {
    onEdit(user.id);
  }, [user.id, onEdit]);

  return (
    <div className={`user-card ${className}`}>
      {/* Component content */}
    </div>
  );
};
\`\`\`

---

## Git Workflow

### Branch Strategy (GitFlow)
\`\`\`
main                    # Production-ready code
├── develop            # Integration branch
├── feature/           # Feature branches
│   ├── feature/auth-system
│   └── feature/dashboard-ui
├── release/           # Release preparation
│   └── release/v1.2.0
└── hotfix/           # Critical fixes
    └── hotfix/security-patch
\`\`\`

### Commit Message Format (Conventional Commits)
\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
\`\`\`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
\`\`\`
feat(auth): implement OAuth2 authentication
fix(api): resolve user profile update bug
docs(readme): update installation instructions
\`\`\`

### Git Rules (MANDATORY)
1. **Never push directly to `main` or `develop`**
2. **All commits must pass CI/CD checks**
3. **Pull requests require 2 approvals**
4. **Branch protection rules are enforced**
5. **Rebase before merging to keep history clean**
6. **Delete feature branches after merging**

### Pre-commit Hooks (Required)
\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
\`\`\`

---

## API Development

### REST API Standards
1. **Use proper HTTP status codes**
2. **Consistent URL patterns**: `/api/v1/users/{id}/posts`
3. **Request/Response validation with schemas**
4. **Rate limiting implemented**
5. **Authentication required for all endpoints**

### API Response Format (MANDATORY)
\`\`\`typescript
// ✅ SUCCESS Response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    filters?: FilterMeta;
  };
}

// ❌ ERROR Response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
\`\`\`

### OpenAPI Documentation (Required)
\`\`\`yaml
# Every endpoint must have OpenAPI spec
/api/v1/users/{id}:
  get:
    summary: Get user by ID
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
    responses:
      200:
        description: User found
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserResponse'
\`\`\`

### Database Standards
1. **Use migrations for all schema changes**
2. **Add proper indexes for query performance**
3. **Use transactions for multi-step operations**
4. **Never store sensitive data in plain text**
5. **Implement soft deletes where appropriate**

---

## Architecture Guidelines

### Architectural Patterns
1. **Frontend**: Feature-based modular architecture
2. **Backend**: Layered architecture with clean separation
3. **Database**: Repository pattern for data access
4. **State Management**: Redux Toolkit for complex state
5. **API Communication**: React Query for server state

### Service Layer Structure
\`\`\`typescript
// ✅ GOOD: Proper service layer
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(userData.password);
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      this.logger.info('User created', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new UserCreationError('Failed to create user');
    }
  }
}
\`\`\`

### Error Handling Standards
\`\`\`typescript
// ✅ GOOD: Proper error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
if (!user) {
  throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
}
\`\`\`

---

## Testing Standards

### Test Coverage Requirements
- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys
- **Component Tests**: All UI components

### Test Structure (Jest/Vitest)
\`\`\`typescript
// ✅ GOOD: Proper test structure
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userService = new UserService(mockUserRepository, mockLogger);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = { email: 'test@test.com', password: 'password' };
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: expect.any(String) // hashed password
      });
    });
  });
});
\`\`\`

### Testing Rules (MANDATORY)
1. **All new features must have tests**
2. **Tests must pass before merging**
3. **No skipped tests in production**
4. **Mock external dependencies**
5. **Test edge cases and error scenarios**

---

## Security Requirements

### Authentication & Authorization
1. **JWT tokens with proper expiration**
2. **Role-based access control (RBAC)**
3. **Rate limiting on all endpoints**
4. **Input validation and sanitization**
5. **HTTPS everywhere**

### Data Security
\`\`\`typescript
// ✅ GOOD: Proper data handling
const sensitiveData = {
  password: await bcrypt.hash(plainPassword, 12),
  apiKey: encrypt(apiKey, process.env.ENCRYPTION_KEY!),
  creditCard: maskCreditCard(creditCardNumber)
};

// ❌ BAD: Insecure data handling
const sensitiveData = {
  password: plainPassword,
  apiKey: apiKey,
  creditCard: creditCardNumber
};
\`\`\`

### Environment Variables (Required)
\`\`\`bash
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/creozel
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-encryption-key
REDIS_URL=redis://localhost:6379
\`\`\`

---

## Documentation Rules

### Code Documentation (JSDoc)
\`\`\`typescript
/**
 * Creates a new user account with encrypted password
 * @param userData - User registration data
 * @param userData.email - User's email address
 * @param userData.password - Plain text password (will be hashed)
 * @returns Promise resolving to created user object
 * @throws {UserCreationError} When email already exists or validation fails
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 * ```
 */
async function createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
}
\`\`\`

### README Requirements (Every Feature)
\`\`\`markdown
# Feature Name

## Overview
Brief description of what this feature does.

## Usage
Code examples showing how to use the feature.

## API Reference
List of available functions/components with parameters.

## Testing
Instructions for running tests.

## Contributing
Guidelines for contributing to this feature.
\`\`\`

---

## Performance Standards

### Frontend Performance
1. **Core Web Vitals compliance**:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
2. **Bundle size limits**:
   - Initial bundle < 250KB
   - Route-based code splitting
   - Tree shaking enabled
3. **Image optimization**:
   - Next.js Image component
   - WebP format with fallbacks
   - Proper lazy loading

### Backend Performance
1. **API response times < 200ms**
2. **Database query optimization**
3. **Caching strategy implemented**
4. **Connection pooling for databases**

### Monitoring (Required)
\`\`\`typescript
// Performance monitoring
import { performance } from 'perf_hooks';

const startTime = performance.now();
await someOperation();
const endTime = performance.now();

logger.info('Operation completed', {
  duration: endTime - startTime,
  operation: 'someOperation'
});
\`\`\`

---

## Team Collaboration

### Code Review Standards
1. **All PRs require 2 approvals**
2. **Review checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No security vulnerabilities
   - [ ] Performance impact considered
3. **Review within 24 hours**
4. **Be constructive, not destructive**

### Communication Rules
1. **Daily standups at 9:30 AM**
2. **Sprint planning every 2 weeks**
3. **Use Slack for async communication**
4. **Create tickets for all work**
5. **Update progress in real-time**

### Definition of Done
- [ ] Feature implemented according to requirements
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] No eslint/typescript errors
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Deployed to staging environment
- [ ] QA testing completed

---

## Enforcement & Violations

### Automated Enforcement
- Pre-commit hooks prevent bad commits
- CI/CD pipeline blocks non-compliant code
- SonarQube quality gates
- Dependency vulnerability scanning

### Violation Consequences
1. **First violation**: Coaching session
2. **Second violation**: Formal documentation
3. **Third violation**: Performance improvement plan
4. **Continued violations**: Role reassignment

### Exceptions
- **Emergency hotfixes**: Can bypass some rules with team lead approval
- **Legacy code**: Gradual migration plan required
- **External libraries**: Document deviations and rationale

---

## Tools & Setup

### Required IDE Extensions (Windsurf/VS Code)
\`\`\`json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "@typescript-eslint.typescript-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint"
  ]
}
\`\`\`

### CI/CD Pipeline
\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run type checking
        run: npm run type-check
      - name: Run tests
        run: npm run test:coverage
      - name: Build application
        run: npm run build
\`\`\`

---

## Final Notes

**This document is living and will be updated as the project evolves. All team members are expected to:**

1. **Read and understand these rules completely**
2. **Ask questions if anything is unclear**
3. **Suggest improvements through proper channels**
4. **Enforce these standards in code reviews**
5. **Lead by example**

**Remember**: These rules exist to ensure code quality, maintainability, and team productivity. They are not suggestions—they are requirements.

**Last Updated**: July 30, 2025  
**Next Review**: August 30, 2025

---

*For questions or clarifications, contact the development team lead or create an issue in the project repository.*
