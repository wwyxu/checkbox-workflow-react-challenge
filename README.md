# Workflow Builder

## Overview

A React-based visual workflow builder application that allows users to create workflows with different types of nodes through a drag-and-drop interface.

## Features

- **Node Types**: Start, Form, Conditional, API, and End blocks
- **Visual Canvas**: ReactFlow-powered workflow canvas with drag-and-drop support
- **Block Panel**: Left sidebar with draggable workflow blocks
- **Modern UI**: Built with @radix-ui/themes design system
- **TypeScript**: Full TypeScript support throughout the application

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd workflow-challenge-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- **React 18** with TypeScript
- **@radix-ui/themes** for UI components
- **ReactFlow** for workflow canvas
- **React Hook Form** for form management
- **Vite** for build tooling

## Project Structure

```
src/
├── components/
│   ├── WorkflowEditor.tsx         # Main workflow canvas
│   ├── BlockPanel.tsx             # Left panel with draggable blocks
│   ├── WorkflowModal.tsx          # Modal for editing workflow details
│   ├── common/                    # Reusable UI components
│   │   ├── Modal.tsx              # Higher order component modal
│   │   └── ModalFooter.tsx
│   ├── nodeconfig/                # Node configuration modals
│   │   ├── common/                # Reusable form components
│   │   │   ├── ErrorAlert.tsx
│   │   │   ├── FieldCheckBoxItem.tsx
│   │   │   ├── FieldEditor.tsx
│   │   │   ├── FieldSelector.tsx
│   │   │   ├── FieldsList.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── FormSelect.tsx
│   │   ├── ApiNodeConfig.tsx
│   │   ├── DefaultNodeConfig.tsx
│   │   └── FormNodeConfig.tsx
│   └── nodes/                     # Individual node visual components
│       ├── ApiNode.tsx
│       ├── ConditionalNode.tsx
│       ├── EndNode.tsx
│       ├── FormNode.tsx
│       └── StartNode.tsx
├── constants/                     # Constants and enums
│   ├── cache/
│   ├── errors/
│   ├── nodes/
│   └── index.ts
├── hooks/                         
│   └── useClickOutside.tsx        # Custom hook which is used to close the modal when clicking outside
├── models/                        # Data models and interfaces
│   ├── index.ts
│   └── models.ts
│   └── validation.ts
├── pages/                         # Page-level components
│   ├── Index.tsx
│   └── NotFound.tsx
├── utils/                         # Utility functions
│   └── nodes
│   └── index.ts
│   └── selectState.ts         # Fixes a racing condition bug between useClickOutside and a dropdown field 
│   └── workflow.ts
├── validation/                    # Schema validation and rules
│   ├── __tests__/                 # Unit tests for validation
│   ├── common/  
│   ├── forms/
│   │   ├── ApiNodeConfig.ts
│   │   ├── FormNodeConfig.ts
│   │   ├── Schema.ts              # Define Schemas to validate forms
│   │   └── ValidForms.ts
│   ├── workflow/
│   │   └── ValidPath.ts
│   └── index.ts
└── index.ts  
```

## Approaches and Tradeoffs

### Redux for global state management

Pros:<br>
   - Cleaner code, more maintainable, scalable with better seperation of concerns = better for testing as well
   - See Modal

Cons:<br>
   - Takes longer to implement and develop features for in the short term
   - Bundle size would increase due to redux module 

### Validation

Previous implementation: Simply check each field with a function to see if they are valid<br>

Pros:<br>
   - Simple and quick to implement<br>
Cons:<br>
   - Not as scalable and contains alot of duplicate code\

Schema Factory Pattern<br>
Pros:<br>
   - More extensible, easy to read. Can define different schemas for nodes which can extend from the same base schema\
Cons:<br>
   - Takes longer to implement the foundations<br>

### Using a number as the id of nodes

Pros:<br>
   - Simple to implement and quick<br>
Cons:<br>
   - Not good for extensibility, eg if we were to turn this into a collaborative app. Better to use a uuid (slower however)<br>

### Node Creation

Previous implementation just simply creates a new node with essentially an if else using clean e6 syntax<br>
Pros:<br>
   - Quick and easy to implement<br>
Cons:\
   - Difficult to maintain if we were to have many different new node types<br>

Factory Pattern: (Can alternatively implement this with a switch statement)<br>
Pros:<br>
   - Easy to implement to new nodes simply by adding new schemas<br>
Cons:<br>
   - Longer to implement foundations, simply unnecessary if their aren't alot of different node types<br>

#### Modal Alternative Approaches

Current approach:<br>
- Importing footer to each child node config so we can we can manage validation and state internally, whilst passing onsave to the footer. Quickest to implement but not the cleanest solution as we are passing footer multiple times to the same type of components.
Redux to manage state:
- Best solution long term, takes longer to implement but more scalable and maintainable, we can combine footer and modal together and change footer behaviour depending on the current node selected.
Alternative approach without redux:
- Lift state up from the nodemodal components, ex to workflow modal/modal and manage validation, state, saving there. Can use react context to make it a bit cleaner. Somewhere in the middle of the 2 above approaches in terms of time required to develop vs scalability/maintainability.

### Alternative Approach to folder/file structure

- Naming files index.ts and nesting them within a folder of its intended name, can decouple logic further this way and nest child components within the folder
- Pros, easier to scale and maintain child components
- Cons, more folders to manage

ex.
```
│   ├── modal/                    
│   │   ├── index.tsx
│   │   ├── anyotherdecoupledlogic.tsx
│   |   ├── footer/      
│   |   ├── ├── index.tsx      
```

## Assumptions and limitation

Assumed that the assignment was to test development under real world time constraints, where deadlines must be met. Thus cut corners to achieve something deliverable within the time frame. e.g sacrificing code quality for results.

## How the implementation supports future extensibility
- Can create new schemas for new nodes and validation
- Reusable components are in common folders and lifted to the highest point in the folder hierarchy where they are used.
- Would ideally implement redux for future proofing
- Things are well organized and seperated by use case

## Testing strategy
Wrote unit tests for the most important logic, would extend this to include integration/e2e tests with more time

## Improvements

- Adding more typescript types, avoiding any
- Moving more of the javascript styles to styles.css
- Implement Redux
- E2e/integration testing
- Create a dynamic form component which renders fields based on the object type
