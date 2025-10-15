import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, AlertTriangle, Calendar, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    status: "healthy" | "warning" | "critical";
    vin: string;
    mileage: number;
  };
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const navigate = useNavigate();

  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      color: "text-status-healthy",
      bgColor: "bg-status-healthy/10",
      borderColor: "border-status-healthy/30",
      label: "Healthy",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
      borderColor: "border-status-warning/30",
      label: "Attention Needed",
    },
    critical: {
      icon: AlertCircle,
      color: "text-status-critical",
      bgColor: "bg-status-critical/10",
      borderColor: "border-status-critical/30",
      label: "Critical",
    },
  };

  const config = statusConfig[vehicle.status];
  const StatusIcon = config.icon;

  return (
    <Card className={`border-2 ${config.borderColor} hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <CardDescription className="mt-1">VIN: {vehicle.vin}</CardDescription>
          </div>
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <StatusIcon className={`h-6 w-6 ${config.color}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={vehicle.status === "healthy" ? "default" : "destructive"} className={`${config.bgColor} ${config.color}`}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Mileage</span>
          <span className="font-medium">{vehicle.mileage.toLocaleString()} miles</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/vehicle/${vehicle.id}`)}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/booking?vehicle=${vehicle.id}`)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;