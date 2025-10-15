# Copilot Instructions for Noter Project

## Project Overview
Noter is a local note-taking application built with Electron, React, and TypeScript. It follows clean architecture principles and emphasizes test-driven development (TDD) with rapid feedback loops.

## Core Development Principles

### 1. Test-Driven Development (TDD)
- **ALWAYS write tests before implementing features**
- Follow Red-Green-Refactor cycle:
  1. Write failing test (Red)
  2. Implement minimal code to pass (Green)
  3. Refactor and improve (Refactor)
- Maintain high test coverage (>80%)
- Test at multiple levels: unit, integration, and e2e

### 2. Clean Architecture & SOLID Principles
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Clients shouldn't depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### 3. Layer Separation
```
├── Domain Layer (entities, value objects)
├── Application Layer (use cases, services)
├── Infrastructure Layer (database, external APIs)
└── Presentation Layer (React components, UI)
```

### 4. Continuous Feedback Loop
- Run tests after every change
- Fix failing tests immediately
- Refactor frequently to maintain code quality
- Use linting and formatting tools consistently

## Technology Stack Guidelines

### Electron (Main Process)
- Keep business logic in services, not main.ts
- Use proper IPC patterns with type safety
- Handle errors gracefully with proper logging
- Implement proper window lifecycle management

### React (Renderer Process)
- Use functional components with hooks
- Implement proper state management with Zustand
- Follow component composition patterns
- Maintain component purity and testability

### TypeScript
- Use strict type checking
- Define proper interfaces for all data structures
- Avoid `any` type - use proper typing
- Implement proper error handling with typed exceptions

### Database (SQLite)
- Use repository pattern for data access
- Implement proper migrations for schema changes
- Handle database errors with fallbacks
- Maintain data integrity with proper constraints

## Development Workflow

### When Adding New Features:
1. **Write comprehensive tests first**
   - Unit tests for business logic
   - Integration tests for components
   - E2E tests for user workflows

2. **Implement with minimal code**
   - Focus on making tests pass
   - Avoid over-engineering initially
   - Use interfaces for extensibility

3. **Refactor and improve**
   - Extract common patterns
   - Optimize performance if needed
   - Update documentation

4. **Verify and polish**
   - Run full test suite
   - Check code coverage
   - Verify user experience

### When Fixing Bugs:
1. **Write test that reproduces the bug**
2. **Fix the bug with minimal changes**
3. **Verify test passes and others still work**
4. **Refactor if needed for clarity**

### Code Quality Standards

#### File Organization
- Group related functionality together
- Use clear, descriptive file names
- Maintain consistent folder structure
- Keep files focused and cohesive

#### Naming Conventions
- Use PascalCase for components and classes
- Use camelCase for functions and variables
- Use SCREAMING_SNAKE_CASE for constants
- Use descriptive, intention-revealing names

#### Error Handling
- Use proper error types and messages
- Implement graceful error recovery
- Log errors appropriately for debugging
- Provide user-friendly error feedback

#### Performance
- Implement proper memoization where needed
- Optimize re-renders in React components
- Use proper database indexing
- Profile and measure performance improvements

## Testing Guidelines

### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Focus on business logic validation
- Aim for fast execution (<1ms per test)

### Integration Tests
- Test component interactions
- Test database operations
- Test IPC communication
- Verify proper error handling

### E2E Tests
- Test complete user workflows
- Test cross-platform compatibility
- Verify data persistence
- Test performance under load

### Test Structure
```typescript
describe('FeatureName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

## Documentation Standards

### Code Documentation
- Document complex business logic
- Explain non-obvious design decisions
- Maintain API documentation
- Include usage examples

### User Documentation
- Keep README updated
- Document keyboard shortcuts
- Explain configuration options
- Provide troubleshooting guides

## Security Considerations

### Electron Security
- Disable node integration in renderer
- Use context isolation
- Validate all IPC messages
- Implement proper CSP headers

### Data Security
- Encrypt sensitive data at rest
- Validate all user inputs
- Implement proper access controls
- Audit data access patterns

## Performance Guidelines

### Application Performance
- Minimize startup time
- Optimize memory usage
- Implement efficient data structures
- Use proper caching strategies

### UI Performance
- Minimize re-renders
- Use virtual scrolling for large lists
- Implement proper loading states
- Optimize bundle size

## Future Extensibility

### Plugin System
- Design with plugin architecture in mind
- Use dependency injection patterns
- Maintain stable APIs
- Document extension points

### Scalability
- Design for growing data sets
- Implement proper pagination
- Use efficient search algorithms
- Plan for distributed scenarios

## Common Patterns to Follow

### State Management
```typescript
// Use Zustand for global state
const useStore = create<State>((set, get) => ({
  // State and actions
}))
```

### Error Boundaries
```typescript
// Implement proper error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### Service Layer
```typescript
// Use dependency injection
class NoteService {
  constructor(private db: DatabaseService) {}
}
```

## Anti-Patterns to Avoid

### React Anti-Patterns
- Don't mutate props directly
- Don't use array indices as keys
- Don't call hooks conditionally
- Don't skip dependency arrays

### General Anti-Patterns
- Don't use global variables
- Don't ignore error handling
- Don't skip testing
- Don't write overly complex functions

## Code Review Checklist

### Before Submitting PR:
- [ ] All tests pass
- [ ] Code coverage maintained
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance considered
- [ ] Security reviewed

### During Code Review:
- [ ] Code follows architecture principles
- [ ] Tests are comprehensive
- [ ] Error handling is proper
- [ ] Performance implications considered
- [ ] Documentation is clear
- [ ] Security vulnerabilities addressed

## Quick Commands Reference

```bash
# Development
pnpm dev              # Start with hot reload
pnpm test             # Run tests in watch mode
pnpm lint:fix         # Fix linting issues

# Quality Assurance
pnpm test:coverage    # Check test coverage
pnpm build            # Verify build works
pnpm package:dir      # Test packaging

# Debugging
pnpm dev:debug        # Start with debugging
pnpm test:debug       # Debug specific tests
```

## Remember: ALWAYS test, fix, and iterate in tight feedback loops to maintain high code quality and rapid development pace.