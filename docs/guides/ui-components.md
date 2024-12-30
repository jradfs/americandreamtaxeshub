# UI Components Guide

## Project Management Components

### ProjectCard
The ProjectCard component is designed for efficient project management and quick access to key information.

#### Features
- **Priority Indicators**: Left border color indicates project priority (blue: low, yellow: medium, red: high)
- **Status Display**: Clear status badges with semantic colors
  - Not Started: Gray
  - In Progress: Blue
  - Waiting for Info: Yellow
  - Needs Review: Purple
  - Completed: Green
  - Archived: Red

#### Information Hierarchy
1. **Header Section**
   - Project name
   - Return type badge
   - Client information
   - Status badge
   - Quick actions menu

2. **Progress Section**
   - Task completion count
   - Visual progress bar
   - Percentage indicator

3. **Footer Section**
   - Tax year information
   - Due date with warning for near-due items
   - Missing documents warning

#### Usage
```tsx
<ProjectCard 
  project={projectData} 
  onProjectUpdated={handleProjectUpdate} 
/>
```

#### Best Practices
1. **Information Display**
   - Keep project names concise
   - Use badges for important metadata
   - Show warnings prominently for attention items

2. **Interaction Design**
   - Quick access to edit and view options
   - Clear visual feedback for interactive elements
   - Consistent spacing and alignment

3. **Performance Considerations**
   - Efficient rendering with proper memoization
   - Responsive layout for all screen sizes
   - Optimized for large project lists

#### Accessibility
- Color combinations meet WCAG contrast requirements
- Screen reader support for status and actions
- Keyboard navigation support
- Clear focus indicators

#### Future Improvements
1. **Planned Enhancements**
   - Customizable quick actions
   - Filter by status/priority
   - Batch actions support
   - Enhanced search capabilities

2. **Team Efficiency Features**
   - Quick task assignment
   - Status update shortcuts
   - Document upload indicators
   - Team member avatars
