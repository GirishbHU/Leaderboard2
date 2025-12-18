import { ReactNode } from "react";
import { RotatingInsightsQuotes } from "./rotating-insights-quotes";

interface PageWithSidePanelsProps {
  children: ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  className?: string;
}

export function PageWithSidePanels({ 
  children, 
  showLeftPanel = true, 
  showRightPanel = true,
  className = ""
}: PageWithSidePanelsProps) {
  return (
    <div className={`flex w-full min-h-screen ${className}`}>
      {showLeftPanel && (
        <aside className="hidden xl:flex w-72 shrink-0 sticky top-0 h-screen overflow-hidden border-r bg-gradient-to-b from-muted/30 to-background">
          <div className="w-full h-full flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Insights
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <RotatingInsightsQuotes variant="sidebar" startOffset={0} />
            </div>
          </div>
        </aside>
      )}
      
      <main className="flex-1 min-w-0">
        {children}
      </main>
      
      {showRightPanel && (
        <aside className="hidden xl:flex w-72 shrink-0 sticky top-0 h-screen overflow-hidden border-l bg-gradient-to-b from-muted/30 to-background">
          <div className="w-full h-full flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Featured
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <RotatingInsightsQuotes variant="sidebar" startOffset={15} />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
