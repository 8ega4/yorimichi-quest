import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { LoadingScreen } from "./components/LoadingScreen";
import { CompleteScreen } from "./features/discovery/CompleteScreen";
import { DiscoveryScreen } from "./features/discovery/DiscoveryScreen";
import { HomeScreen } from "./features/home/HomeScreen";
import { JournalScreen } from "./features/journal/JournalScreen";
import { QuestSelectScreen } from "./features/quest/QuestSelectScreen";

const QuestRunScreen = lazy(() =>
  import("./features/quest/QuestRunScreen").then((module) => ({ default: module.QuestRunScreen })),
);
const MapHistoryScreen = lazy(() =>
  import("./features/map/MapHistoryScreen").then((module) => ({ default: module.MapHistoryScreen })),
);

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeScreen />} />
        <Route path="choose" element={<QuestSelectScreen />} />
        <Route path="quest" element={<Suspense fallback={<LoadingScreen />}><QuestRunScreen /></Suspense>} />
        <Route path="discover" element={<DiscoveryScreen />} />
        <Route path="complete/:id" element={<CompleteScreen />} />
        <Route path="map" element={<Suspense fallback={<LoadingScreen />}><MapHistoryScreen /></Suspense>} />
        <Route path="journal" element={<JournalScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
