import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu, Network, Clock, MemoryStick } from "lucide-react";
import { cn } from "@/lib/utils";

// Temporary mock data - replace with actual data fetching
const mockSystemHealth = {
  status: "healthy",
  uptime: "99.99%",
  lastCheck: new Date().toISOString(),
  resources: {
    cpu: {
      usage: 45,
      status: "normal",
    },
    memory: {
      usage: 62,
      status: "warning",
    },
    disk: {
      usage: 78,
      status: "warning",
    },
    network: {
      status: "normal",
      latency: 45,
    },
  },
  services: [
    {
      name: "API Server",
      status: "healthy",
      uptime: "99.99%",
      lastIncident: null,
    },
    {
      name: "Database",
      status: "healthy",
      uptime: "99.95%",
      lastIncident: null,
    },
    {
      name: "Cache",
      status: "degraded",
      uptime: "99.90%",
      lastIncident: "2024-03-19T15:30:00Z",
    },
    {
      name: "File Storage",
      status: "healthy",
      uptime: "99.98%",
      lastIncident: null,
    },
  ],
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "healthy":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "degraded":
      return "bg-orange-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "healthy":
      return "success";
    case "warning":
      return "warning";
    case "degraded":
      return "destructive";
    case "critical":
      return "destructive";
    default:
      return "secondary";
  }
};

export function SystemHealth() {
  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${getStatusColor(
                  mockSystemHealth.status
                )}`}
              />
              <div className="text-2xl font-bold capitalize">
                {mockSystemHealth.status}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {mockSystemHealth.uptime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSystemHealth.resources.cpu.usage}%
            </div>
            <Progress
              value={mockSystemHealth.resources.cpu.usage}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSystemHealth.resources.memory.usage}%
            </div>
            <Progress
              value={mockSystemHealth.resources.memory.usage}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Network Latency
            </CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSystemHealth.resources.network.latency}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Status: {mockSystemHealth.resources.network.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSystemHealth.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(
                      service.status
                    )}`}
                  />
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Uptime: {service.uptime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs border",
                      getStatusColor(service.status)
                    )}
                  >
                    {service.status}
                  </Badge>
                  {service.lastIncident && (
                    <div className="text-sm text-muted-foreground">
                      Last incident:{" "}
                      {new Date(service.lastIncident).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Check */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Last check: {new Date(mockSystemHealth.lastCheck).toLocaleString()}
      </div>
    </div>
  );
}
