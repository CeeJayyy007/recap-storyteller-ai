import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, AlertTriangle, Info, Bug } from "lucide-react";

interface ErrorLog {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  source: string;
  stack?: string;
  user?: string;
}

// Temporary mock data - replace with actual data fetching
const mockErrorLogs: ErrorLog[] = [
  {
    id: "1",
    timestamp: "2024-03-20T10:00:00Z",
    level: "error",
    message: "Failed to process payment",
    source: "payment-service",
    stack:
      "Error: Payment processing failed\n    at processPayment (/app/services/payment.js:123:45)",
    user: "user-123",
  },
  {
    id: "2",
    timestamp: "2024-03-20T09:45:00Z",
    level: "warning",
    message: "High memory usage detected",
    source: "system-monitor",
    user: "system",
  },
  {
    id: "3",
    timestamp: "2024-03-20T09:30:00Z",
    level: "info",
    message: "User logged in",
    source: "auth-service",
    user: "user-456",
  },
];

const getLevelIcon = (level: string) => {
  switch (level) {
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Bug className="h-4 w-4 text-gray-500" />;
  }
};

const getLevelBadgeVariant = (level: string) => {
  switch (level) {
    case "error":
      return "destructive";
    case "warning":
      return "default";
    case "info":
      return "secondary";
    default:
      return "outline";
  }
};

export function ErrorLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [logs] = useState<ErrorLog[]>(mockErrorLogs);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (log: ErrorLog) => {
    setSelectedLog(log);
  };

  const handleClearLog = (logId: string) => {
    // TODO: Implement log clearing logic
    console.log(`Clearing log ${logId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">Export Logs</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getLevelIcon(log.level)}
                    <Badge variant={getLevelBadgeVariant(log.level)}>
                      {log.level}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {log.message}
                </TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell>{log.user || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(log)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClearLog(log.id)}>
                        Clear Log
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Log Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Message
                </div>
                <div className="mt-1">{selectedLog.message}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Timestamp
                </div>
                <div className="mt-1">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Source
                </div>
                <div className="mt-1">{selectedLog.source}</div>
              </div>
              {selectedLog.user && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    User
                  </div>
                  <div className="mt-1">{selectedLog.user}</div>
                </div>
              )}
              {selectedLog.stack && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Stack Trace
                  </div>
                  <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
