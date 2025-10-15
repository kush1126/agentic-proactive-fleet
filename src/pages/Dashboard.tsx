import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Bell } from "lucide-react";
import { toast } from "sonner";
import VehicleCard from "@/components/VehicleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: "healthy" | "warning" | "critical";
  vin: string;
  mileage: number;
}

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchVehicles();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      setUserName(profile.full_name);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setVehicles(data || []);
    } catch (error: any) {
      toast.error("Failed to load vehicles");
      console.error("Error fetching vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Signed out successfully");
  };

  const stats = {
    total: vehicles.length,
    healthy: vehicles.filter(v => v.status === "healthy").length,
    warning: vehicles.filter(v => v.status === "warning").length,
    critical: vehicles.filter(v => v.status === "critical").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Predictive Maintenance
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back, {userName || "User"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription>Total Vehicles</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-status-healthy/10 to-card/80 border-status-healthy/20">
            <CardHeader className="pb-2">
              <CardDescription>Healthy</CardDescription>
              <CardTitle className="text-3xl text-status-healthy">{stats.healthy}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-status-warning/10 to-card/80 border-status-warning/20">
            <CardHeader className="pb-2">
              <CardDescription>Warning</CardDescription>
              <CardTitle className="text-3xl text-status-warning">{stats.warning}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-status-critical/10 to-card/80 border-status-critical/20">
            <CardHeader className="pb-2">
              <CardDescription>Critical</CardDescription>
              <CardTitle className="text-3xl text-status-critical">{stats.critical}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Vehicles</h2>
          <Button onClick={() => navigate("/vehicle/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No vehicles added yet</p>
              <Button onClick={() => navigate("/vehicle/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;