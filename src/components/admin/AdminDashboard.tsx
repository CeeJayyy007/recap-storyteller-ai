import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/UsersTable";
import { ConfigTable } from "@/components/admin/ConfigTable";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { SystemHealth } from "@/components/admin/SystemHealth";
import { ErrorLogs } from "@/components/admin/ErrorLogs";
import { AdminPasscodeModal } from "@/components/admin/AdminPasscodeModal";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "admin-secure-key"; // Should match the key in AdminPasscodeModal

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      const encryptedAuth = sessionStorage.getItem("adminAuth");
      if (encryptedAuth) {
        try {
          const decrypted = CryptoJS.AES.decrypt(
            encryptedAuth,
            ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);
          if (decrypted === "000478") {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error decrypting auth:", error);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Show nothing while checking initial auth
  if (isChecking) {
    return null;
  }

  // If not authenticated, only show the modal
  if (!isAuthenticated) {
    return (
      <AdminPasscodeModal onAuthenticated={() => setIsAuthenticated(true)} />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <ConfigTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemHealth />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorLogs />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
