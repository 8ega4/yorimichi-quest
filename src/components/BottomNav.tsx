import { House, MapTrifold, Notebook } from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";
import { withSampleMode } from "../lib/sampleMode";

const items = [
  { to: "/", label: "今日", icon: House, end: true },
  { to: "/map", label: "地図", icon: MapTrifold, end: false },
  { to: "/journal", label: "記録", icon: Notebook, end: false },
];

export function BottomNav() {
  const location = useLocation();
  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          className={({ isActive }) => `bottom-nav__item${isActive ? " is-active" : ""}`}
          to={withSampleMode(to, location.search)}
          end={end}
        >
          <Icon size={24} weight="fill" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
