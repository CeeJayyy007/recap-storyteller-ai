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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  plan: "free" | "pro";
  status: "active" | "suspended";
  lastLogin: string;
}

// Temporary mock data - replace with actual data fetching
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    plan: "pro",
    status: "active",
    lastLogin: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    email: "user@example.com",
    role: "user",
    plan: "free",
    status: "active",
    lastLogin: "2024-03-19T15:30:00Z",
  },
];

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    // TODO: Implement role change logic
    console.log(`Changing role for user ${userId} to ${newRole}`);
  };

  const handlePlanChange = (userId: string, newPlan: "free" | "pro") => {
    // TODO: Implement plan change logic
    console.log(`Changing plan for user ${userId} to ${newPlan}`);
  };

  const handleStatusChange = (
    userId: string,
    newStatus: "active" | "suspended"
  ) => {
    // TODO: Implement status change logic
    console.log(`Changing status for user ${userId} to ${newStatus}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.plan === "pro" ? "default" : "secondary"}
                  >
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "outline"}
                    className={cn(
                      "text-xs border",
                      user.status === "active"
                        ? "bg-green-500 text-white dark:bg-green-500 dark:text-white"
                        : "bg-red-500 text-white dark:bg-red-500 dark:text-white"
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.lastLogin).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(
                            user.id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                      >
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePlanChange(
                            user.id,
                            user.plan === "pro" ? "free" : "pro"
                          )
                        }
                      >
                        Change Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.status === "active" ? "suspended" : "active"
                          )
                        }
                      >
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
