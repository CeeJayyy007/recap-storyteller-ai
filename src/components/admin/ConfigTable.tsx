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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, Save } from "lucide-react";

interface ConfigItem {
  id: string;
  key: string;
  value: string | boolean;
  type: "string" | "boolean";
  description: string;
  category: "system" | "feature" | "integration";
}

// Temporary mock data - replace with actual data fetching
const mockConfigs: ConfigItem[] = [
  {
    id: "1",
    key: "enable_registration",
    value: true,
    type: "boolean",
    description: "Allow new user registrations",
    category: "system",
  },
  {
    id: "2",
    key: "max_tasks_per_user",
    value: "100",
    type: "string",
    description: "Maximum number of tasks per user",
    category: "feature",
  },
  {
    id: "3",
    key: "enable_ai_features",
    value: true,
    type: "boolean",
    description: "Enable AI-powered features",
    category: "feature",
  },
  {
    id: "4",
    key: "stripe_api_key",
    value: "sk_test_...",
    type: "string",
    description: "Stripe API key for payments",
    category: "integration",
  },
];

export function ConfigTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [configs, setConfigs] = useState<ConfigItem[]>(mockConfigs);
  const [editingValues, setEditingValues] = useState<
    Record<string, string | boolean>
  >({});

  const filteredConfigs = configs.filter(
    (config) =>
      config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleValueChange = (id: string, value: string | boolean) => {
    setEditingValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string) => {
    const newValue = editingValues[id];
    if (newValue !== undefined) {
      setConfigs((prev) =>
        prev.map((config) =>
          config.id === id ? { ...config, value: newValue } : config
        )
      );
      // TODO: Implement API call to save config
      console.log(`Saving config ${id} with value:`, newValue);
    }
    setEditingValues((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "system":
        return "default";
      case "feature":
        return "secondary";
      case "integration":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search configurations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-mono">{config.key}</TableCell>
                <TableCell>
                  {config.type === "boolean" ? (
                    <Switch
                      checked={
                        (editingValues[config.id] as boolean) ??
                        (config.value as boolean)
                      }
                      onCheckedChange={(checked) =>
                        handleValueChange(config.id, checked)
                      }
                    />
                  ) : (
                    <Input
                      value={
                        (editingValues[config.id] as string) ??
                        (config.value as string)
                      }
                      onChange={(e) =>
                        handleValueChange(config.id, e.target.value)
                      }
                      className="w-[200px]"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{config.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getCategoryBadgeVariant(config.category)}>
                    {config.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {config.description}
                </TableCell>
                <TableCell>
                  {editingValues[config.id] !== undefined && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(config.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
