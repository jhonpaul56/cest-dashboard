# Supabase Setup Guide for CEST 2.0 Dashboard

## Step 1: Install Supabase Client

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

## Step 2: Get Your Supabase Credentials

1. Go to https://supabase.com
2. Sign in or create account
3. Create a new project (name it "cest-dashboard")
4. Wait for project to be ready (2-3 minutes)
5. Go to Project Settings > API
6. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (starts with: eyJhbGc...)

## Step 3: Add Credentials to .env

Add these lines to your `.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Create Database Tables

Go to your Supabase project > SQL Editor and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project TEXT NOT NULL,
  municipality TEXT NOT NULL,
  community TEXT,
  province TEXT DEFAULT 'Cagayan',
  year INTEGER NOT NULL,
  amount_funded DECIMAL(12, 2),
  amount_per_year DECIMAL(12, 2),
  status TEXT CHECK (status IN ('Ongoing', 'Finished', 'Liquidated')),
  components TEXT[], -- Array of components: sel, hn, hrd, drrm, bgcet, dg
  beneficiaries JSONB, -- JSON object with total, male, female, ips, fourps, pwd
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT 'Admin User',
  is_archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE
);

-- Equipment Table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment TEXT NOT NULL,
  municipality TEXT NOT NULL,
  year INTEGER NOT NULL,
  units INTEGER NOT NULL DEFAULT 1,
  component TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT 'Admin User'
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL CHECK (action IN ('create', 'upload', 'edit', 'update', 'delete', 'archive', 'restore')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('Project', 'Equipment', 'User', 'Settings', 'System')),
  entity_id UUID,
  entity_name TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  user_name TEXT DEFAULT 'Admin User',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STARBOOKS Table
CREATE TABLE starbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  municipality TEXT,
  province TEXT,
  region TEXT,
  beneficiary_type TEXT CHECK (beneficiary_type IN ('Academic', 'LGU', 'NGA', 'NGO')),
  installation_date DATE,
  hardware_specs JSONB,
  software_version TEXT,
  maintenance_history JSONB,
  contact_info JSONB,
  usage_stats JSONB,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_municipality ON projects(municipality);
CREATE INDEX idx_projects_year ON projects(year);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_archived ON projects(is_archived);
CREATE INDEX idx_equipment_municipality ON equipment(municipality);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_starbooks_region ON starbooks(region);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_starbooks_updated_at
  BEFORE UPDATE ON starbooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE starbooks ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on equipment" ON equipment FOR ALL USING (true);
CREATE POLICY "Allow all operations on audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on starbooks" ON starbooks FOR ALL USING (true);
```

## Step 5: Verify Tables Created

In Supabase Dashboard:
1. Go to Table Editor
2. You should see 4 tables:
   - ✅ projects
   - ✅ equipment
   - ✅ audit_logs
   - ✅ starbooks

## Step 6: Test Connection

After I create the Supabase service file, you can test it by:

```javascript
import { supabase } from './src/shared/services/supabaseClient';

// Test connection
const { data, error } = await supabase.from('projects').select('count');
console.log('Connected!', data);
```

## Next Steps

After completing the above steps, I will:
1. ✅ Create Supabase client service
2. ✅ Create database service functions
3. ✅ Update your components to use Supabase
4. ✅ Migrate localStorage data to Supabase (optional)

## Benefits of Using Supabase

✅ **Real-time sync** - Multiple users see updates instantly
✅ **Cloud backup** - Data is safe in the cloud
✅ **Scalable** - Handles thousands of projects
✅ **Authentication** - Built-in user management
✅ **API** - Automatic REST and GraphQL APIs
✅ **Free tier** - 500MB database, 2GB bandwidth
✅ **PostgreSQL** - Powerful relational database

## Important Notes

⚠️ **Keep your keys secret!** Never commit `.env` file to git
⚠️ **Backup first** - Export your localStorage data before migrating
⚠️ **Test thoroughly** - Test all features after migration

---

Ready to proceed? Let me know when you've:
1. ✅ Installed Supabase client (`npm install @supabase/supabase-js`)
2. ✅ Created Supabase project
3. ✅ Added credentials to `.env`
4. ✅ Run the SQL script in Supabase SQL Editor

Then I'll create the integration code!
