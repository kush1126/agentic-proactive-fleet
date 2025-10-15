import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Calendar, AlertTriangle, TrendingUp, Gauge } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: "healthy" | "warning" | "critical";
  vin: string;
  mileage: number;
  license_plate: string;
}

interface Prediction {
  id: string;
  component: string;
  failure_probability: number;
  predicted_failure_date: string;
  confidence_score: number;
  recommendation: string;
  is_critical: boolean;
  contributing_factors: any;
}

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  const fetchVehicleData = async () => {
    try {
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (vehicleError) throw vehicleError;
      setVehicle(vehicleData);

      const { data: predictionData, error: predictionError } = await supabase
        .from("predictions")
        .select("*")
        .eq("vehicle_id", id)
        .order("failure_probability", { ascending: false })
        .limit(5);

      if (predictionError) throw predictionError;
      setPredictions(predictionData || []);
    } catch (error: any) {
      toast.error("Failed to load vehicle data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading vehicle data...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Vehicle not found</p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    healthy: { color: "text-status-healthy", label: "Healthy" },
    warning: { color: "text-status-warning", label: "Attention Needed" },
    critical: { color: "text-status-critical", label: "Critical" },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <Badge variant={vehicle.status === "healthy" ? "default" : "destructive"}>
              {statusConfig[vehicle.status].label}
            </Badge>
          </div>
          <p className="text-muted-foreground">VIN: {vehicle.vin}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status</CardDescription>
              <CardTitle className={statusConfig[vehicle.status].color}>
                {statusConfig[vehicle.status].label}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Mileage</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                {vehicle.mileage.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>License Plate</CardDescription>
              <CardTitle>{vehicle.license_plate || "N/A"}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Quick Action</CardDescription>
              <CardTitle>
                <Button size="sm" onClick={() => navigate(`/booking?vehicle=${vehicle.id}`)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Service
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Predictive Maintenance Insights
            </CardTitle>
            <CardDescription>
              AI-powered predictions for potential component failures
            </CardDescription>
          </CardHeader>
          <CardContent>
            {predictions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No predictions available yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Predictions will appear as telemetry data is collected
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <Card key={prediction.id} className={`border-l-4 ${prediction.is_critical ? "border-l-status-critical" : "border-l-status-warning"}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">
                          {prediction.component.replace(/_/g, " ")}
                        </CardTitle>
                        <Badge variant={prediction.is_critical ? "destructive" : "default"}>
                          {Math.round(prediction.failure_probability * 100)}% Risk
                        </Badge>
                      </div>
                      <CardDescription>
                        Confidence: {Math.round(prediction.confidence_score * 100)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${prediction.is_critical ? "text-status-critical" : "text-status-warning"}`} />
                        <p className="text-sm">{prediction.recommendation}</p>
                      </div>
                      {prediction.predicted_failure_date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Estimated failure date: {new Date(prediction.predicted_failure_date).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VehicleDetail;