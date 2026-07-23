import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { db } from "../src/lib/db";

describe("home privacy gate", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("opens quest selection without touching geolocation", async () => {
    const watchPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition, clearWatch: vi.fn() },
    });
    render(<MemoryRouter><App /></MemoryRouter>);
    const start = await screen.findByRole("button", { name: "今日の寄り道をはじめる" });
    expect(watchPosition).not.toHaveBeenCalled();
    await userEvent.click(start);
    expect(await screen.findByRole("heading", { name: "今日の寄り道" })).toBeInTheDocument();
    expect(watchPosition).not.toHaveBeenCalled();
  });
});
