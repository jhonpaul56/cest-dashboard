# Audit Log System

## Overview

The Audit Log System replaces the traditional notification system with a comprehensive activity tracking solution. It logs all user actions including uploads, deletes, edits, creates, archives, and restores.

## Features

### 🎯 Core Functionality
- **Real-time Activity Tracking**: Automatically logs all user actions
- **Persistent Storage**: Logs are saved to localStorage and persist across sessions
- **Search & Filter**: Search by description, user, or details; filter by action type
- **Beautiful UI**: Modern, user-friendly interface with smooth animations
- **Action Icons**: Visual indicators for different action types
- **Timestamps**: Relative time display (e.g., "5 minutes ago", "2 hours ago")
- **Entity Types**: Categorizes logs by Project, Equipment, User, Settings, or System

### 📊 Action Types
- **Create**: New items added to the system
- **Upload**: Files or data uploaded
- **Edit/Update**: Modifications to existing items
- **Delete**: Items removed from the system
- **Archive**: Items moved to archive
- **Restore**: Items restored from archive

### 🎨 Visual Design
- Color-coded action badges
- Hover effects and animations
- Dark mode support
- Responsive layout
- Smooth transitions

## Usage

### Accessing the Audit Log
Click the **Database icon** (📊) in the top navigation bar to open the audit log panel.

### Searching Activities
Use the search bar to find specific activities by:
- Description text
- User name
- Details/metadata

### Filtering by Action
1. Click "Filter by Action" button
2. Select an action type (create, upload, edit, delete, archive, restore)
3. View filtered results

## Implementation

### Components

#### `AuditLog.jsx`
The main UI component that displays the audit log panel with search and filter capabilities.

**Props:**
- `logs` (array): Array of audit log entries
- `onClose` (function): Callback to close the panel
- `darkMode` (boolean): Dark mode toggle

#### `auditService.js`
Service layer that manages audit log creation and distribution.

**Key Methods:**
- `logCreate()`: Log creation of new items
- `logUpload()`: Log file/data uploads
- `logEdit()`: Log edits to existing items
- `logUpdate()`: Log updates to items
- `logDelete()`: Log deletions
- `logArchive()`: Log archiving actions
- `logRestore()`: Log restore actions

#### `useAuditLog.js`
React hook for managing audit logs in components.

**Returns:**
- `logs`: Array of all audit logs
- `clearLogs()`: Clear all logs
- `deleteLog(id)`: Delete a specific log
- `getLogsByAction(action)`: Filter logs by action type
- `getLogsByEntity(entityType)`: Filter logs by entity type
- `getLogsByDateRange(start, end)`: Filter logs by date range
- `getRecentLogs(count)`: Get most recent N logs

### Adding Audit Logs

```javascript
import { auditService, ENTITY_TYPES } from '../shared/services/auditService';

// Log a project creation
auditService.logCreate(
  ENTITY_TYPES.PROJECT,
  'Project Name',
  'Additional details here'
);

// Log an equipment upload
auditService.logUpload(
  ENTITY_TYPES.EQUIPMENT,
  'Equipment Name',
  'Quantity: 5, Location: Gonzaga'
);

// Log a project edit
auditService.logEdit(
  ENTITY_TYPES.PROJECT,
  'Project Name',
  'Changed status from Pending to Ongoing'
);

// Log a deletion
auditService.logDelete(
  ENTITY_TYPES.PROJECT,
  'Project Name'
);

// Log an archive action
auditService.logArchive(
  ENTITY_TYPES.PROJECT,
  'Project Name'
);

// Log a restore action
auditService.logRestore(
  ENTITY_TYPES.PROJECT,
  'Project Name'
);
```

### Entity Types

```javascript
export const ENTITY_TYPES = {
  PROJECT: 'Project',
  EQUIPMENT: 'Equipment',
  USER: 'User',
  SETTINGS: 'Settings',
  SYSTEM: 'System',
};
```

### Log Structure

Each audit log entry contains:

```javascript
{
  id: 'audit_1234567890_abc123',
  action: 'create',              // Action type
  entityType: 'Project',         // Entity type
  entityId: 'proj_123',          // Optional entity ID
  entityName: 'CEST 2.0',        // Entity name
  description: 'Created project: "CEST 2.0"',
  details: 'Municipality: Gonzaga, Budget: ₱150,000',
  user: 'Admin User',            // User who performed the action
  timestamp: '2026-04-13T09:30:00.000Z',
  metadata: {}                   // Additional metadata
}
```

## Configuration

### Maximum Logs
The system keeps the last 100 logs by default. Modify in `useAuditLog.js`:

```javascript
const MAX_LOGS = 100; // Change this value
```

### Default User
Set the default user in `auditService.js`:

```javascript
user = 'Admin User' // Change default user name
```

## Benefits Over Notifications

1. **Comprehensive History**: Full activity log vs temporary notifications
2. **Searchable**: Find specific activities quickly
3. **Filterable**: View activities by type
4. **Persistent**: Logs survive page refreshes
5. **Audit Trail**: Complete record of system changes
6. **Better UX**: More informative and actionable

## Future Enhancements

- Export logs to CSV/PDF
- Date range filtering UI
- User-specific filtering
- Log retention policies
- Integration with backend API
- Real-time sync across devices
- Advanced analytics dashboard
- Email notifications for critical actions

## Troubleshooting

### Logs not appearing
- Check localStorage: `cest_audit_logs`
- Verify auditService is imported correctly
- Ensure useAuditLog hook is called in component

### Search not working
- Check search term spelling
- Try filtering by action type first
- Clear search and try again

### Performance issues
- Reduce MAX_LOGS value
- Clear old logs periodically
- Implement pagination for large datasets

## Support

For issues or questions about the audit log system, contact the development team or refer to the main project documentation.
