import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecapGeneratorPanel } from "@/components/recap/RecapGeneratorPanel";
import { RecapOutputPanel } from "@/components/recap/RecapOutputPanel";
import { RecapLibrary } from "@/components/recap/RecapLibrary";
import { DeleteRecapModal } from "@/components/modals/DeleteRecapModal";
import { useRecapStore } from "@/stores/recap-store";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BookOpen, Settings, Sparkles } from "lucide-react";

const Recap = () => {
  const [showLibrary, setShowLibrary] = useState(true);
  const { savedRecaps, generatedContent } = useRecapStore();

  return (
    <div className="h-full bg-background container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recap</h1>
            <p className="text-muted-foreground mt-1">
              The story of your work, one summary at a time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showLibrary ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLibrary(!showLibrary)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Library ({savedRecaps.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup
          direction="horizontal"
          className="border border-border rounded-lg"
        >
          {/* Generator Panel */}
          <Panel defaultSize={30} minSize={25} maxSize={40}>
            <div className="border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Recap Generator
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure your recap settings
                </p>
              </div>
              <ScrollArea className="h-[calc(100vh-140px)]">
                <RecapGeneratorPanel />
              </ScrollArea>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-border/80 transition-colors" />

          {/* Output Panel */}
          <Panel defaultSize={showLibrary ? 45 : 70} minSize={40}>
            <div className="h-full">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generated Recap
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {generatedContent
                    ? "Review and edit your recap before saving"
                    : "Configure settings and generate your recap"}
                </p>
              </div>
              <ScrollArea className="h-[calc(100vh-140px)]">
                <RecapOutputPanel />
              </ScrollArea>
            </div>
          </Panel>

          {/* Library Panel */}
          {showLibrary && (
            <>
              <PanelResizeHandle className="w-1 bg-border hover:bg-border/80 transition-colors" />
              <Panel defaultSize={25} minSize={20} maxSize={35}>
                <div className="h-full border-l border-border">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Recap Library
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {savedRecaps.length} saved recap
                      {savedRecaps.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ScrollArea className="h-[calc(100vh-140px)]">
                    <RecapLibrary />
                  </ScrollArea>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Delete Modal */}
      <DeleteRecapModal />
    </div>
  );
};

export default Recap;
