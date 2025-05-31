import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({
  onSearch,
  placeholder = "Search tasks",
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className="pl-10 bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}
