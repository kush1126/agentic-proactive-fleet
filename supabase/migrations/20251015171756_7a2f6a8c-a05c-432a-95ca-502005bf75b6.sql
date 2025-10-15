-- Create enum types
CREATE TYPE user_role AS ENUM ('vehicle_owner', 'service_center_manager', 'fleet_admin', 'manufacturing_team', 'platform_admin');
CREATE TYPE vehicle_status AS ENUM ('healthy', 'warning', 'critical');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE component_type AS ENUM ('engine', 'transmission', 'brakes', 'battery', 'suspension', 'electrical', 'cooling_system', 'fuel_system');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'vehicle_owner',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT UNIQUE NOT NULL,
  license_plate TEXT,
  status vehicle_status NOT NULL DEFAULT 'healthy',
  mileage INTEGER DEFAULT 0,
  last_service_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create telemetry table
CREATE TABLE public.telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  engine_temp NUMERIC,
  oil_pressure NUMERIC,
  battery_voltage NUMERIC,
  brake_pad_thickness NUMERIC,
  tire_pressure JSONB,
  error_codes TEXT[],
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create service_centers table
CREATE TABLE public.service_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  operating_hours JSONB,
  services_offered TEXT[],
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_center_id UUID NOT NULL REFERENCES public.service_centers(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  service_type TEXT NOT NULL,
  estimated_duration INTEGER,
  assigned_mechanic TEXT,
  notes TEXT,
  completion_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  component component_type NOT NULL,
  failure_probability NUMERIC NOT NULL,
  predicted_failure_date TIMESTAMPTZ,
  confidence_score NUMERIC NOT NULL,
  contributing_factors JSONB,
  recommendation TEXT,
  is_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create rca_reports table
CREATE TABLE public.rca_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  component component_type,
  failure_description TEXT NOT NULL,
  root_cause TEXT,
  capa_suggestions JSONB,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rca_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS Policies for vehicles
CREATE POLICY "Vehicle owners can view their vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = owner_id);
  
CREATE POLICY "Vehicle owners can insert their vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
  
CREATE POLICY "Vehicle owners can update their vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Fleet admins can view all vehicles" ON public.vehicles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'fleet_admin'
  ));

-- Create RLS Policies for telemetry
CREATE POLICY "Vehicle owners can view their telemetry" ON public.telemetry
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.vehicles WHERE id = telemetry.vehicle_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Allow telemetry insertion" ON public.telemetry
  FOR INSERT WITH CHECK (true);

-- Create RLS Policies for service_centers
CREATE POLICY "Everyone can view service centers" ON public.service_centers
  FOR SELECT USING (true);

CREATE POLICY "Managers can update their service center" ON public.service_centers
  FOR UPDATE USING (auth.uid() = manager_id);

-- Create RLS Policies for bookings
CREATE POLICY "Vehicle owners can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = owner_id);
  
CREATE POLICY "Vehicle owners can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Service managers can view bookings for their center" ON public.bookings
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.service_centers WHERE id = bookings.service_center_id AND manager_id = auth.uid()
  ));

CREATE POLICY "Service managers can update bookings for their center" ON public.bookings
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.service_centers WHERE id = bookings.service_center_id AND manager_id = auth.uid()
  ));

-- Create RLS Policies for predictions
CREATE POLICY "Vehicle owners can view their predictions" ON public.predictions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.vehicles WHERE id = predictions.vehicle_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Allow prediction insertion" ON public.predictions
  FOR INSERT WITH CHECK (true);

-- Create RLS Policies for rca_reports
CREATE POLICY "Manufacturing team can view all reports" ON public.rca_reports
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('manufacturing_team', 'platform_admin')
  ));

CREATE POLICY "Allow RCA report creation" ON public.rca_reports
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_centers_updated_at BEFORE UPDATE ON public.service_centers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rca_reports_updated_at BEFORE UPDATE ON public.rca_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();