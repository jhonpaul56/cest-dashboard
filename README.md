# CEST 2.0 Dashboard

A modern, comprehensive dashboard for the Department of Science and Technology (DOST) Community Empowerment through Science & Technology (CEST 2.0) program, featuring integrated STARBOOKS digital library management.

## Features

### Core Dashboard Features
- **Modern UI Design**: Clean, professional interface with dark/light mode
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data**: Track projects, communities, budgets, and equipment
- **Interactive Charts**: Visualize data with bar charts, pie charts, and analytics
- **Advanced Filtering**: Search and filter projects by year, status, and more
- **Dark Mode**: Eye-friendly dark theme with smooth transitions

### STARBOOKS Integration
- **Digital Library Management**: Complete STARBOOKS inventory system
- **8,917 Kiosks Nationwide**: Track all STARBOOKS units across the Philippines
- **Regional Distribution**: Monitor Luzon (53%), Visayas (17%), Mindanao (30%)
- **Beneficiary Tracking**: Academic institutions (90%), LGUs (6%), NGAs (3%), NGOs (1%)
- **Unit Management**: Add, edit, delete, and maintain STARBOOKS units
- **Analytics Dashboard**: Usage patterns and performance metrics

### AI-Powered Features
- **Intelligent ChatBot**: AI assistant with complete system knowledge
- **STARBOOKS Expertise**: AI knows all about digital library management
- **Data Analysis**: AI-powered insights and recommendations
- **Natural Language Queries**: Ask questions in plain English
- **Smart Navigation**: AI can guide you to any section

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icon set
- **OpenAI API** - AI-powered ChatBot functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key (for ChatBot functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/jhonpaul56/cest-dashboard.git
cd cest-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# OpenAI API Key for ChatBot functionality
# Get your API key from: https://platform.openai.com/api-keys
VITE_AI_API_KEY=your_openai_api_key_here
```

## Project Structure

```
src/
├── app/                 # Core application files
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── components/
│   ├── layout/         # Layout components
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── Breadcrumb.jsx
│   ├── ui/             # Reusable UI components
│   │   ├── ChatBot.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoadingButton.jsx
│   │   └── Toast.jsx
│   └── forms/          # Form components
│       └── AddProjectEquipmentModal.jsx
├── features/           # Feature-based organization
│   ├── dashboard/      # Dashboard page
│   ├── analytics/      # Analytics pages
│   ├── data-entry/     # Data entry functionality
│   ├── monitoring/     # Project monitoring
│   ├── starbooks/      # STARBOOKS management
│   ├── archive/        # Archived projects
│   ├── settings/       # Settings page
│   └── auth/           # Authentication
├── shared/             # Shared utilities
│   ├── constants/      # App constants
│   ├── data/           # Static data and knowledge
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services (AI, etc.)
│   └── utils/          # Utility functions
└── assets/             # Images and static files
```

## Features Overview

### Dashboard
- Overview of all projects and key metrics
- Real-time statistics and charts
- Recent projects and status distribution
- Quick navigation to all sections

### Analytics
- Interactive province, city, and barangay navigation
- Budget distribution charts
- Component breakdown analysis
- Clickable charts for drill-down navigation

### Data Entry
- Unified project and equipment entry form
- Smart validation and suggestions
- AI-powered data insights
- Comprehensive beneficiary tracking

### STARBOOKS Management
- Complete digital library inventory
- Unit specifications and maintenance records
- Regional distribution analytics
- Add/edit/delete STARBOOKS units
- Usage statistics and performance metrics

### AI ChatBot
- Complete system knowledge
- STARBOOKS expertise (8,917 units nationwide)
- Natural language queries
- Smart navigation assistance
- Data analysis and insights

### Monitoring
- Project status tracking
- Advanced filtering and search
- Progress monitoring
- Timeline management

## STARBOOKS Information

### What is STARBOOKS?
STARBOOKS (Science and Technology Academic and Research-Based Openly Operated KioskS) is the Philippines' first Science and Technology digital library in a box.

### Key Statistics
- **Total Units**: 8,917 kiosks nationwide
- **Regional Distribution**: 53% Luzon, 17% Visayas, 30% Mindanao
- **Beneficiaries**: 90% Academic, 6% LGUs, 3% NGAs, 1% NGOs

### Mission
To democratize access to science and technology information by providing digital library services to underserved communities, particularly in remote and rural areas of the Philippines.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Feature-based folder organization
- Use functional components with hooks
- Follow Tailwind CSS utility-first approach
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic

### AI Integration

The ChatBot uses OpenAI's API to provide intelligent assistance:
- Complete knowledge of CEST 2.0 system
- STARBOOKS digital library expertise
- Data analysis and insights
- Natural language query processing

## Security

- Environment variables for sensitive data
- API keys stored securely in `.env` file
- `.env` file excluded from version control
- GitHub push protection enabled

## License

© 2026 Department of Science and Technology (DOST)

## Support

For support and questions, please contact the DOST CEST 2.0 team.

### STARBOOKS Support
- **Main Office**: DOST-STII, Bicutan, Taguig City
- **Hotline**: (02) 8837-2071 to 82
- **Email**: starbooks@dost.gov.ph
- **Website**: www.starbooks.dost.gov.ph
