import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/stores/modal-store";

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({
  placeholder = "Search tasks",
}: SearchInputProps) {
  const { openSearch } = useModalStore();

  const handleFocus = () => {
    openSearch();
  };

  const handleClick = () => {
    openSearch();
  };

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        onFocus={handleFocus}
        onClick={handleClick}
        readOnly
        className="pl-10 bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
      />
    </div>
  );
}
