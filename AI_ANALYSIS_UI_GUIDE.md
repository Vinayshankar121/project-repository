# AI Analysis UI Components Guide

## Layout Structure

The AI Analysis panel displays results in the following order:

### 1. Similarity Score Section
```
┌─────────────────────────────────────────┐
│ 🎯 Similarity Score      [High Similarity] │
│                                         │
│                  90%                    │
│ ████████████████████████░░░░░░░░       │
│                                         │
│ (Progress bar reflects the score)       │
└─────────────────────────────────────────┘
```
- **Color Coding**:
  - Green (< 40%): Low similarity, safe to proceed
  - Yellow (40-70%): Moderate similarity, review needed
  - Red (≥ 70%): High similarity, significant changes needed

### 2. Overlapping Points Section (if any)
```
┌─────────────────────────────────────────┐
│ 🎯 Overlapping Points                   │
│                                         │
│ ✓ System title: 'Smart Attendance...'   │
│ ✓ Core functionality: biometric...      │
│                                         │
└─────────────────────────────────────────┘
```
- Blue-themed card
- Shows specific points of overlap with existing projects
- Each point marked with a checkmark

### 3. Recommended Technologies Section (if any)
```
┌─────────────────────────────────────────┐
│ ⚡ Recommended Technologies             │
│                                         │
│ [PostgreSQL]  [React]  [Angular]        │
│ [Node.js]     [TypeScript]              │
│                                         │
└─────────────────────────────────────────┘
```
- Purple-themed card
- Technologies displayed as badges
- Suggestions for tech stack improvements

### 4. Improvement Suggestions Section (if any)
```
┌─────────────────────────────────────────┐
│ 💡 Improvement Suggestions              │
│                                         │
│ → Refine abstract for clarity...        │
│ → Clearly articulate the novel...       │
│ → Detail how the fingerprint...         │
│                                         │
└─────────────────────────────────────────┘
```
- Yellow-themed card
- Action items with arrow icons
- Specific suggestions for improvement

### 5. Final Verdict Section
```
✓ Good to Go:
┌─────────────────────────────────────────┐
│ ✓ Final Verdict                         │
│                                         │
│ This project looks promising and has    │
│ good potential for approval.            │
│                                         │
└─────────────────────────────────────────┘

⚡ Needs Work:
┌─────────────────────────────────────────┐
│ ⚡ Final Verdict                        │
│                                         │
│ Minor revisions needed for clarity      │
│ and better articulation of novelty.     │
│                                         │
└─────────────────────────────────────────┘

⚠️ Significant Changes Required:
┌─────────────────────────────────────────┐
│ ⚠️ Final Verdict                        │
│                                         │
│ Requires significant revision for       │
│ clarity and differentiation.            │
│                                         │
└─────────────────────────────────────────┘
```
- Dynamically colored based on verdict severity
- Icon changes based on outcome
- Clear, prominent messaging

## Interactive Features

### Button States

**Default (Collapsed)**
```
[✨ AI Analysis]  ← Click to expand
```

**Expanded with Analysis Running**
```
┌──────────────────────────┐
│ ✨ AI-Powered Analysis  │ [↻] [✕]
│                          │
│    ⟳ Analyzing...        │
│                          │
└──────────────────────────┘
```

**Expanded with Error**
```
┌──────────────────────────┐
│ ✨ AI-Powered Analysis  │ [↻] [✕]
│                          │
│ ⚠ Analysis Failed        │
│ [error message]          │
│ [troubleshooting tip]    │
│                          │
└──────────────────────────┘
```

**Expanded with Results**
```
┌──────────────────────────┐
│ ✨ AI-Powered Analysis  │ [↻] [✕]
│                          │
│ [Similarity Score]       │
│ [Overlapping Points]     │
│ [Recommended Tech]       │
│ [Improvements]           │
│ [Final Verdict]          │
│                          │
└──────────────────────────┘
```

### Control Buttons
- **↻ Refresh**: Re-run the analysis
- **✕ Close**: Close the analysis panel

## API Response Mapping

The component maps API responses to UI sections as follows:

| API Field | UI Section | Icon | Color |
|-----------|-----------|------|-------|
| `similarityPercentage` | Similarity Score | 🎯 | Dynamic (Green/Yellow/Red) |
| `overlappingPoints` | Overlapping Points | ✓ | Blue (#2563EB) |
| `recommendedTechnologies` | Recommended Technologies | ⚡ | Purple (#A855F7) |
| `improvementSuggestions` | Improvement Suggestions | 💡 | Yellow (#F59E0B) |
| `finalVerdict` | Final Verdict | Varies | Dynamic |

## Error States

### No API Server
```
┌──────────────────────────┐
│ ✨ AI-Powered Analysis  │
│                          │
│ ❌ Analysis Failed       │
│                          │
│ API error: Connection    │
│ refused                  │
│                          │
│ Make sure the API server │
│ is running at            │
│ http://localhost:2111    │
│                          │
│ [↻ Refresh]              │
└──────────────────────────┘
```

## Usage Examples

### In Submit Abstract Page
```tsx
<AIAnalysisButton
  title={title}
  abstract={abstract}
  technologies={selectedTech}
  department={user?.department || 'mca'}
/>
```

### In Submit Project Page
```tsx
<AIAnalysisButton
  title={title}
  abstract={description}
  technologies={selectedTech}
  department={user?.department || 'mca'}
/>
```

### In My Submissions Page
```tsx
<AIAnalysisButton
  title={project.title}
  abstract={project.abstract}
  technologies={project.technologies}
  department={user?.department || 'mca'}
  projectId={project.id}
/>
```

## Responsive Design

The component is fully responsive:
- **Mobile**: Single column layout with readable text
- **Tablet**: Optimized spacing and font sizes
- **Desktop**: Full-width cards with proper padding

All color-coded sections maintain visual hierarchy and clarity on all screen sizes.
