import { useState, useEffect, useRef } from "react";
import { Search, Calendar, Clock, CheckCircle, RotateCw, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/stores/modal-store";
import { useTaskStore } from "@/stores/task-store";
import { useDateStore } from "@/stores/date-store";
import { Task } from "@/types/task";
import { getTaskStatusForDate } from "@/types/task";
import { formatDate } from "@/lib/utils";

interface SearchCriteria {
  title: string;
  description: string;
  tags: string;
}

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useModalStore();
  const { tasks } = useTaskStore();
  const { setSelectedDate } = useDateStore();
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    title: "",
    description: "",
    tags: "",
  });
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Debounced search function
  const performSearch = (criteria: SearchCriteria) => {
    const { title, description, tags } = criteria;
    
    // If all criteria are empty, show no results
    if (!title.trim() && !description.trim() && !tags.trim()) {
      setSearchResults([]);
      return;
    }

    const results = tasks.filter((task) => {
      const titleMatch = !title.trim() || 
        task.title.toLowerCase().includes(title.toLowerCase());
      
      const descriptionMatch = !description.trim() || 
        task.description.toLowerCase().includes(description.toLowerCase());
      
      const tagsMatch = !tags.trim() || 
        task.tags.some(tag => tag.toLowerCase().includes(tags.toLowerCase()));

      return titleMatch && descriptionMatch && tagsMatch;
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle search input changes with debouncing
  const handleSearchChange = (field: keyof SearchCriteria, value: string) => {
    const newCriteria = { ...searchCriteria, [field]: value };
    setSearchCriteria(newCriteria);
    setIsSearching(true);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(newCriteria);
    }, 300);
  };

  // Group results by current status (relative to today)
  const getGroupedResults = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const grouped = {
      carriedOver: [] as Task[],
      pending: [] as Task[],
      completed: [] as Task[],
    };

    searchResults.forEach((task) => {
      const status = getTaskStatusForDate(task, today);
      if (status === 'carried-over') grouped.carriedOver.push(task);
      else if (status === 'pending') grouped.pending.push(task);
      else if (status === 'completed') grouped.completed.push(task);
    });

    return grouped;
  };

  const handleJumpToTask = (task: Task) => {
    // Navigate to task's creation date
    const createdDate = new Date(task.createdAt);
    setSelectedDate(createdDate);
    
    // Store task ID for highlighting
    localStorage.setItem('highlightTaskId', task.id);
    
    closeSearch();
  };

  const renderTaskResult = (task: Task, status: string) => {
    const statusInfo = {
      'carried-over': { 
        icon: <RotateCw className="h-4 w-4 text-red-600" />, 
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
      },
      'pending': { 
        icon: <Clock className="h-4 w-4 text-orange-600" />, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
      },
      'completed': { 
        icon: <CheckCircle className="h-4 w-4 text-green-600" />, 
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
      },
    };

    const info = statusInfo[status as keyof typeof statusInfo];

    return (
      <div key={task.id} className={`p-3 rounded-lg border ${info.bgColor} mb-3`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {info.icon}
              <h4 className="font-medium text-sm truncate">{task.title}</h4>
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created: {formatDate(task.createdAt.split('T')[0])}</span>
              {task.completedAt && (
                <>
                  <span>•</span>
                  <span>Completed: {formatDate(task.completedAt.split('T')[0])}</span>
                </>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleJumpToTask(task)}
            className="ml-2 flex-shrink-0"
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Jump
          </Button>
        </div>
      </div>
    );
  };

  const groupedResults = getGroupedResults();

  return (
    <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Tasks
          </DialogTitle>
        </DialogHeader>

        {/* Search Inputs */}
        <div className="space-y-4 flex-shrink-0">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Search by title..."
              value={searchCriteria.title}
              onChange={(e) => handleSearchChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Input
              placeholder="Search by description..."
              value={searchCriteria.description}
              onChange={(e) => handleSearchChange('description', e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              placeholder="Search by tags..."
              value={searchCriteria.tags}
              onChange={(e) => handleSearchChange('tags', e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 min-h-0 mt-4">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {isSearching ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  <p>Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks found</p>
                </div>
              ) : (
                <>
                  {/* Carried Over Tasks */}
                  {groupedResults.carriedOver.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <RotateCw className="h-4 w-4" />
                        Carried Over ({groupedResults.carriedOver.length})
                      </h3>
                      {groupedResults.carriedOver.map((task) => 
                        renderTaskResult(task, 'carried-over')
                      )}
                    </div>
                  )}

                  {/* Pending Tasks */}
                  {groupedResults.pending.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending ({groupedResults.pending.length})
                      </h3>
                      {groupedResults.pending.map((task) => 
                        renderTaskResult(task, 'pending')
                      )}
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {groupedResults.completed.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Completed ({groupedResults.completed.length})
                      </h3>
                      {groupedResults.completed.map((task) => 
                        renderTaskResult(task, 'completed')
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
} 