# System Switcher Guide

## Overview

The application now supports switching between two different systems with completely different sidebars:

1. **CEST 2.0** - Community Empowerment through Science and Technology Dashboard
2. **STARBOOKS** - Digital Library Management System

## How It Works

### User Experience

Users can switch between systems using the **system switcher button** located at the top of the sidebar:

- **In CEST Sidebar**: Shows "CEST 2.0" with a button to "Switch to STARBOOKS"
- **In STARBOOKS Sidebar**: Shows "STARBOOKS" with a button to "Switch to CEST"

### Visual Differences

#### CEST Sidebar (Blue Theme)
- **Color**: Blue gradient (#004A98 to #0066CC)
- **Logo**: DOST logo
- **Navigation Items**:
  - Dashboard
  - Analytics
  - Monitoring
  - Data Entry
  - Starbooks
  - Trainings
  - Archive

#### STARBOOKS Sidebar (Green Theme)
- **Color**: Green gradient (#10b981 to #059669)
- **Logo**: BookOpen icon
- **Navigation Items**:
  - Inventory
  - Locations
  - Users
  - Reports
  - Maintenance
  - Documentation

## Implementation Details

### Files Created/Modified

1. **Created**: `src/components/layout/StarbooksSidebar.jsx`
   - New sidebar component for STARBOOKS system
   - Green theme with book-related navigation

2. **Modified**: `src/components/layout/Sidebar.jsx`
   - Added system switcher button at the top
   - Added `onSwitchSystem` prop

3. **Modified**: `src/app/App.jsx`
   - Added `activeSystem` state (persisted in localStorage)
   - Conditional rendering of sidebars based on active system
   - `handleSwitchSystem()` function to toggle between systems

### State Management

```jsx
const [activeSystem, setActiveSystem] = usePersistedState("active_system", "cest");
```

The active system is persisted in localStorage, so users' preference is remembered across sessions.

### Switching Logic

```jsx
const handleSwitchSystem = () => {
  const newSystem = activeSystem === "cest" ? "starbooks" : "cest";
  setActiveSystem(newSystem);
  
  if (newSystem === "starbooks") {
    setActivePage("starbooks");
    navigate("/starbooks");
    success("Switched to STARBOOKS system");
  } else {
    setActivePage("dashboard");
    navigate("/dashboard");
    success("Switched to CEST system");
  }
};
```

## Features

✅ **Persistent State** - System preference saved in localStorage
✅ **Smooth Transitions** - Animated sidebar switching
✅ **Different Navigation** - Each system has its own menu items
✅ **Visual Distinction** - Different colors and branding
✅ **Toast Notifications** - Feedback when switching systems
✅ **Responsive Design** - Works on all screen sizes
✅ **Collapsible** - Both sidebars support collapse/expand

## Usage

### For Users

1. Look at the top of the sidebar
2. Click the system switcher button
3. The sidebar will change to the other system
4. Navigation items will update automatically

### For Developers

To add new navigation items to either sidebar:

**CEST Sidebar** (`Sidebar.jsx`):
```jsx
const NAV_ITEMS = [
  { id: "new-item", icon: YourIcon, label: "New Item" },
  // ... other items
];
```

**STARBOOKS Sidebar** (`StarbooksSidebar.jsx`):
```jsx
const STARBOOKS_NAV_ITEMS = [
  { id: "new-item", icon: YourIcon, label: "New Item" },
  // ... other items
];
```

## Customization

### Changing Colors

**CEST Theme**:
```jsx
background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'
```

**STARBOOKS Theme**:
```jsx
background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
```

### Adding More Systems

To add a third system:

1. Create a new sidebar component (e.g., `ThirdSystemSidebar.jsx`)
2. Update `activeSystem` state to support the new value
3. Add conditional rendering in `App.jsx`
4. Update the switcher button to cycle through all systems

## Benefits

- **Clear Separation**: Different systems have distinct interfaces
- **Better UX**: Users know exactly which system they're in
- **Scalable**: Easy to add more systems in the future
- **Maintainable**: Each sidebar is independent
- **Professional**: Looks like enterprise software with role switching

## Similar To

This pattern is similar to:
- Facebook's "Switch to Page" feature
- Admin/Customer view toggles
- Multi-tenant applications
- Role-based dashboards
