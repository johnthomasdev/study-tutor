# Study Tutor - Frontend

A modern, modular React application for document-based question answering using Retrieval-Augmented Generation (RAG).

## 🏗️ Architecture

This frontend follows a clean, modular architecture with proper separation of concerns:

### 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # App header with logo and session controls
│   ├── ErrorAlert.jsx   # Error message display
│   ├── FileUpload.jsx   # PDF upload with drag & drop
│   ├── QuestionForm.jsx # Question input and submission
│   ├── Answer.jsx       # Answer display with sources
│   └── index.js         # Component exports
├── hooks/               # Custom React hooks
│   └── useRAG.js        # RAG system state management
├── utils/               # Utility functions
│   └── api.js           # API service layer
├── App.jsx              # Main application component
├── App.css              # Global styles
└── main.jsx             # React entry point
```

### 🧩 Components

#### `Header.jsx`
- Displays app logo and title
- Conditionally shows "New Session" button
- Handles session reset functionality

#### `ErrorAlert.jsx`
- Displays error messages with proper styling
- Auto-hides when no error is present

#### `FileUpload.jsx`
- Drag & drop PDF upload interface
- File validation and preview
- Upload progress indication
- Success state display

#### `QuestionForm.jsx`
- Question input textarea
- Submit button with loading states
- Form validation

#### `Answer.jsx`
- Displays AI-generated answers
- Shows source document references
- Proper formatting for readability

### 🎣 Custom Hooks

#### `useRAG.js`
- Manages all RAG-related state
- Handles API calls and error states
- Provides clean interface for components
- Session management logic

### 🔧 Utils

#### `api.js`
- Centralized API service layer
- Axios configuration
- Error handling
- Type-safe API calls

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns
- **Custom Hooks**: Reusable state management
- **Component Composition**: Flexible and maintainable UI
- **Error Boundaries**: Proper error handling
- **Type Safety**: PropTypes validation
- **Performance**: Optimized with React.memo and useCallback

## 🎨 Styling

- **Dark Theme**: ChatGPT-inspired color scheme
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Loading states and transitions
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Configuration

The application connects to the FastAPI backend running on `localhost:8000`. Update the API base URL in `src/utils/api.js` if needed.

## 📦 Dependencies

- **React 19**: Latest React features
- **Axios**: HTTP client
- **React Dropzone**: File upload
- **Lucide React**: Icons
- **UUID**: Session management

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🔄 State Management

The application uses a custom hook pattern for state management:

- **Local State**: Component-specific state
- **Shared State**: Managed through `useRAG` hook
- **API State**: Handled in the service layer

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🛠️ Development

### Adding New Components

1. Create component in `src/components/`
2. Add to `src/components/index.js`
3. Import in consuming components

### Adding New Hooks

1. Create hook in `src/hooks/`
2. Follow the `use` prefix convention
3. Use proper dependency arrays

### API Changes

1. Update `src/utils/api.js`
2. Update corresponding hooks
3. Test error handling

## 🔍 Best Practices

- **Component Composition**: Prefer composition over inheritance
- **Pure Functions**: Components should be pure when possible
- **Error Boundaries**: Handle errors gracefully
- **Performance**: Use React.memo and useMemo where appropriate
- **Accessibility**: Include proper ARIA labels

## 🚀 Production Deployment

For production deployment, build the application:

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper PropTypes validation
3. Include error handling
4. Test responsive design
5. Update documentation

## 📄 License

This project is licensed under the MIT License.
