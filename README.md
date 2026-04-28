# Project Repositary - Project Submission & AI Analysis Platform

## 📋 Project Overview

**Project Repositary** is a modern, full-featured project submission and management platform with integrated AI-powered analysis capabilities. It enables users to submit projects, abstracts, and technical proposals while receiving intelligent insights, similarity analysis, and improvement recommendations through an advanced AI analysis engine.

The platform is designed for academic institutions, hackathons, and innovation challenges, allowing seamless project submission workflows with real-time AI feedback to help users refine and improve their project proposals.

---

## ✨ Key Features

### 1. **User Authentication & Management**
- Secure login and registration system
- User profile management
- Role-based access control
- Profile customization with department selection

### 2. **Project Submission**
- Easy-to-use project submission forms
- Support for multiple submission types:
  - Projects with detailed information
  - Project abstracts with AI analysis
  - Technology stack specification
- Form validation and error handling
- Real-time feedback on submissions

### 3. **AI-Powered Analysis Engine**
- **Intelligent Project Analysis**:
  - Similarity percentage detection compared to existing projects
  - Overlapping points identification
  - Improvement suggestions
  - Recommended technologies
  - Final verdict with confidence scores

- **Color-Coded Results**:
  - 🟢 Green (< 40%): Low similarity - Safe to proceed
  - 🟡 Yellow (40-70%): Moderate similarity - Review needed
  - 🔴 Red (≥ 70%): High similarity - Significant changes needed

- **Multi-Section Analysis Display**:
  1. Similarity Score with progress visualization
  2. Overlapping Points with existing projects
  3. Recommended Technologies
  4. Improvement Suggestions
  5. Final Verdict (Good to Go / Needs Work / Significant Changes Required)

### 4. **Dashboard & Navigation**
- Comprehensive dashboard for viewing submitted projects
- Navigation menu with quick access to all features
- Mobile-responsive design
- Intuitive user interface

### 5. **Project Management**
- View all submissions in one place
- Track project status and AI analysis results
- Filter and search capabilities
- Delete or update submissions

---

## 🏗️ Project Architecture & Components

### **Core Pages**

| Page | Purpose |
|------|---------|
| [Home.tsx](src/pages/Home.tsx) | Landing page with introduction and call-to-action |
| [Dashboard.tsx](src/pages/Dashboard.tsx) | Main user dashboard with project overview |
| [Projects.tsx](src/pages/Projects.tsx) | Browse and view all submitted projects |
| [ProjectDetails.tsx](src/pages/ProjectDetails.tsx) | Detailed view of individual projects |
| [SubmitProject.tsx](src/pages/SubmitProject.tsx) | Form for submitting new projects |
| [SubmitAbstract.tsx](src/pages/SubmitAbstract.tsx) | Form for submitting project abstracts with AI analysis |
| [MySubmissions.tsx](src/pages/MySubmissions.tsx) | User's personal submission history |
| [Profile.tsx](src/pages/Profile.tsx) | User profile management page |
| [Login.tsx](src/pages/Login.tsx) | User authentication page |
| [registration.tsx](src/pages/registration.tsx) | New user registration page |
| [NotFound.tsx](src/pages/NotFound.tsx) | 404 error page |

### **Key Components**

#### Main Components:
- **[AIAnalysisButton.tsx](src/components/AIAnalysisButton.tsx)** - Triggers AI analysis and displays detailed results
  - POST request to `http://localhost:2111/ai/abstract-insights`
  - Handles similarity analysis and recommendations
  - Error handling with retry capability

- **[AISuggestionBox.tsx](src/components/AISuggestionBox.tsx)** - Displays AI suggestions and recommendations

- **[Navbar.tsx](src/components/Navbar.tsx)** - Main navigation bar with program links and user menu

- **[NavLink.tsx](src/components/NavLink.tsx)** - Reusable navigation link component

- **[ProjectCard.tsx](src/components/ProjectCard.tsx)** - Display project cards in list/grid view

- **[TechnologyBadge.tsx](src/components/TechnologyBadge.tsx)** - Visual badge for technology tags

- **[Loader.tsx](src/components/Loader.tsx)** - Loading spinner component

#### UI Component Library (shadcn-ui):
- Accordion, Alert, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Checkbox
- Command, Dialog, Drawer, Dropdown Menu
- Form, Input, Label, Progress, Select
- Tabs, Textarea, Toast, Tooltip, and more

---

## 🔐 Context & State Management

### **AuthContext.tsx**
Manages user authentication state:
- User login/logout
- Registration
- Session management
- User role and permissions

### **ProjectContext.tsx**
Manages project-related state:
- Project listings
- Submission data
- Project creation/updates
- Shared project state across components

---

## 🛠️ Technology Stack

### Frontend:
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (lightning-fast build and HMR)
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: shadcn-ui (Built on Radix UI)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack React Query
- **Icons**: Lucide React
- **State Management**: React Context API
- **Package Manager**: Bun (faster alternative to npm)

### Backend (External):
- **AI Analysis API**: REST API at `http://localhost:2111/ai/abstract-insights`

---

## 📦 Project Structure

```
src/
├── pages/                 # Page components (routing)
├── components/            # Reusable UI components
│   └── ui/               # shadcn-ui components
├── context/              # React Context (Auth, Projects)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── data/                 # Mock data for development
├── App.tsx               # Main app component
├── main.tsx              # React DOM render
└── index.css             # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+) installed
- npm, yarn, or bun as package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd project-repositary-main

# Step 3: Install dependencies
npm install
# or
bun install

# Step 4: Start the development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```sh
npm run build
# or
bun run build
```

### Preview Production Build

```sh
npm run preview
# or
bun run preview
```

### Linting

```sh
npm run lint
# or
bun run lint
```

---

## 🔌 API Integration

### AI Analysis Endpoint

**Request:**
```bash
POST http://localhost:2111/ai/abstract-insights
```

**Request Body:**
```json
{
  "department": "mca",
  "title": "Smart Attendance System",
  "abstractText": "This project uses biometric...",
  "technologies": "Java, Spring Boot, OpenCV"
}
```

**Response:**
```json
{
  "similarityPercentage": 90,
  "overlappingPoints": [
    "System title: 'Smart Attendance System'.",
    "Core functionality: biometric attendance..."
  ],
  "improvementSuggestions": [
    "Refine abstract for clarity...",
    "Clearly articulate the novel contribution..."
  ],
  "recommendedTechnologies": [
    "PostgreSQL",
    "React/Angular"
  ],
  "finalVerdict": "Requires significant revision for clarity, novelty, and differentiation from existing approved projects."
}
```

---

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode Support**: Theme switching capability
- **Real-time Validation**: Instant form validation feedback
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: User-friendly error messages and recovery options
- **Accessibility**: Built with accessibility standards (WCAG compliance)

---

## 📝 How to Edit/Contribute

### Using Lovable (Web IDE)
Visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting. Changes auto-commit to this repo.

### Using Local IDE
1. Clone the repository
2. Make your changes
3. Push to the repository
4. Changes will reflect in Lovable

### Direct GitHub Editing
Navigate to the file, click the edit button (pencil icon), make changes, and commit.

### Using GitHub Codespaces
1. Click "Code" → "Codespaces" tab
2. Click "New codespace"
3. Edit and commit your changes

---

## 🌐 Deployment

### Deploy via Lovable
1. Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click Share → Publish

### Using Custom Domain
Navigate to **Project > Settings > Domains** and click **Connect Domain**.

Learn more: [Custom Domain Setup](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 📄 Documentation Files

- [AI_ANALYSIS_IMPLEMENTATION.md](AI_ANALYSIS_IMPLEMENTATION.md) - Technical details of AI analysis features
- [AI_ANALYSIS_UI_GUIDE.md](AI_ANALYSIS_UI_GUIDE.md) - UI/UX guide for AI analysis components

---

## 🤝 Contributing

We welcome contributions! Please ensure:
- Code follows TypeScript best practices
- Components are properly typed
- Styling uses Tailwind CSS classes
- All form validations are implemented
- Reusable components are properly documented

---

## 📄 License

This project is part of the Lovable ecosystem.

---

## 📞 Support

For issues, feature requests, or questions:
- Check the documentation files included in the repo
- Review the component implementations in `src/components/`
- Refer to the context files for state management patterns

---

**Last Updated**: March 2026
**Version**: 1.0.0
"# project-repository" 
