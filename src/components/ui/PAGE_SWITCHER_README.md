# Page Switcher Components

Modern, responsive UI components for switching between STARBOOKS and CEST systems.

## Components

### 1. PageSwitcher (Full Version)
A full-featured page switcher with icons, descriptions, and visual feedback.

**Best for:**
- Main navigation pages
- Dedicated switching interfaces
- Landing pages
- Areas with ample space

**Features:**
- Large, clear buttons with icons
- Descriptive text for each option
- Active page indicator below
- Smooth sliding animation
- Hover effects

**Usage:**
```jsx
import { PageSwitcher } from './components/ui/PageSwitcher';

<PageSwitcher 
  activePage={activeSystem}
  onPageChange={handleSystemChange}
  darkMode={darkMode}
/>
```

### 2. CompactPageSwitcher
A space-efficient version perfect for headers and toolbars.

**Best for:**
- Top navigation bars
- Headers
- Sidebars
- Space-constrained areas

**Features:**
- Compact design
- Icon + label
- Smooth transitions
- Minimal footprint

**Usage:**
```jsx
import { CompactPageSwitcher } from './components/ui/CompactPageSwitcher';

<CompactPageSwitcher 
  activePage={activeSystem}
  onPageChange={handleSystemChange}
  darkMode={darkMode}
/>
```

## Props

Both components accept the same props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activePage` | `string` | Yes | Current active page: "starbooks" or "cest" |
| `onPageChange` | `function` | Yes | Callback when page changes: `(pageId: string) => void` |
| `darkMode` | `boolean` | Yes | Whether dark mode is enabled |

## Integration Example

### In App.jsx:

```jsx
import { PageSwitcher } from "../components/ui/PageSwitcher";

function AppContent() {
  const [activeSystem, setActiveSystem] = usePersistedState("active_system", "cest");
  
  const handleSystemChange = (system) => {
    setActiveSystem(system);
    if (system === "starbooks") {
      navigate("/starbooks");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <main>
      <PageSwitcher 
        activePage={activeSystem}
        onPageChange={handleSystemChange}
        darkMode={darkMode}
      />
      {/* Your content */}
    </main>
  );
}
```

## Styling

The components use:
- Inline styles for dynamic theming
- Tailwind CSS for utilities
- CSS animations from `index.css`
- Lucide React icons

## Accessibility

- Keyboard navigable
- Clear focus states
- Semantic HTML
- ARIA-friendly structure
- High contrast in both themes

## Responsive Design

- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly tap targets
- Flexible layouts

## Customization

To customize colors, modify the gradient values in the component:

```jsx
// Active state gradient
background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'

// Hover state
background: darkMode 
  ? 'rgba(148, 163, 184, 0.1)' 
  : 'rgba(100, 116, 139, 0.05)'
```

## Animation Details

- **Slide In**: Active indicator slides smoothly
- **Scale**: Buttons scale on hover and active
- **Fade**: Smooth opacity transitions
- **Duration**: 300ms for most transitions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Lightweight components
- Optimized animations
- No external dependencies (except Lucide icons)
- Minimal re-renders
