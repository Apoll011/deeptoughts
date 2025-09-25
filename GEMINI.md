# Context Management System Development Task

## Overview
Create a comprehensive React Context system with custom hooks to centralize data management, user storage, and persistent state across the application, eliminating prop drilling and state loss issues.

## Core Requirements

### 1. Context Architecture
- **Global Context Provider**: Centralized data management system
- **Custom Hook Interface**: Single hook to access all managers and storage
- **Persistent State Management**: Maintain filters and app state across navigation
- **Performance Optimization**: Prevent unnecessary recalculations and re-renders

### 2. Context Features
- **User Storage Integration**: Access user data (userStorage) from any component
- **Manager Integration**: Expose manager functions without prop drilling
- **Filter Persistence**: Save and restore filter states when navigating between components
- **State Caching**: Cache computed values to avoid repeated calculations

### 3. Custom Hook Design
```typescript
// Target usage pattern:
const { userStorage, manager, filters, setFilters } = useAppContext();
```

### 4. Filter State Management
- **Persistent Filters**: Maintain filter settings when user:
    - Enters a thought detail view
    - Navigates back to home/list view
    - Switches between different app sections
- **Filter Types**: Support various filter configurations
- **State Recovery**: Restore previous filter state on component re-mount

### 5. Integration Points
Reference and update these existing files:
- @src/components/Home.tsx
- @src/App.tsx
- @src/components/Thought/ThoughtCard.tsx
- @src/components/Thought/Editor/ThoughtEditor.tsx
- **Additional files**: Search for more components using manager/storage

### 6. Implementation Strategy
- **Context Provider**: Wrap app at appropriate level
- **Hook Creation**: Custom hook exposing all necessary functionality
- **State Persistence**: Use appropriate storage mechanism for filters
- **Gradual Migration**: Update existing components to use new context system

## Technical Specifications

### Context Structure
```typescript
interface AppContextType {
  // User data management
  userStorage: UserStorageInterface;
  
  // App managers
  manager: ManagerType;
  
  // Filter state
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  
  // Additional utilities
  isLoading: boolean;
  error: string | null;
}
```

### Custom Hook Interface
```typescript
const useAppContext = () => {
  // Return all context values
  // Provide helper methods
  // Handle error states
}
```

## Problem Solutions

### 1. Prop Drilling Elimination
- **Before**: Pass manager/storage through multiple component layers
- **After**: Access directly via `useAppContext()` in any component

### 2. Filter Persistence
- **Problem**: Filters reset when navigating between thoughts and home
- **Solution**: Store filter state in context with persistence layer

### 3. Performance Optimization
- **Memoization**: Cache expensive calculations
- **Selective Updates**: Only re-render components when relevant data changes

## Implementation Steps

1. **Analyze Current Usage**
    - Search through codebase for manager/storage usage patterns
    - Identify all components requiring refactoring
    - Document current prop drilling chains

2. **Create Context System**
    - Define context interface and types
    - Implement provider component
    - Create custom hook with all functionality

3. **Implement Filter Persistence**
    - Design filter state structure
    - Add persistence mechanism
    - Handle state restoration

4. **Migrate Components**
    - Update @src/components/Home.tsx
    - Update @src/App.tsx
    - Update @src/components/Thought/ThoughtCard.tsx
    - Update @src/components/Thought/Editor/ThoughtEditor.tsx
    - Refactor additional components found during search

5. **Testing & Optimization**
    - Verify filter persistence works correctly
    - Test navigation scenarios
    - Optimize performance with React.memo and useMemo where needed

## Deliverables

1. **Context Provider**: Complete context system with all required functionality
2. **Custom Hook**: Single `useAppContext()` hook exposing all features
3. **Filter Persistence**: Robust filter state management
4. **Component Updates**: All identified components migrated to new system
5. **Documentation**: Clear usage examples and migration guide

## Success Criteria

- **No Prop Drilling**: Manager and storage accessible via hook only
- **Filter Persistence**: Filters maintained across all navigation scenarios
- **Performance**: No degradation in app performance, improved where possible
- **Developer Experience**: Simpler component code, easier to maintain
- **Backwards Compatibility**: Existing functionality preserved during migration

## Commit Strategy
- Commit changes incrementally as you work
- Each major component migration should be a separate commit
- Include descriptive commit messages explaining the refactoring