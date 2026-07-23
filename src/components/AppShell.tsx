import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { seedSampleData } from "../lib/db";
import { isSampleMode } from "../lib/sampleMode";

export function AppShell() {
  useEffect(() => {
    if (isSampleMode()) void seedSampleData();
  }, []);

  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
