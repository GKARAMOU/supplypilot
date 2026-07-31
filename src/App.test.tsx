import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import SupplyPilot from "./App";

afterEach(cleanup);

describe("SupplyPilot dashboard", () => {
  it("renders the operational overview", () => {
    render(<SupplyPilot />);

    expect(screen.getByRole("heading", { name: "Good morning, Georgios." })).toBeInTheDocument();
    expect(screen.getByText("Assyrtiko Santorini")).toBeInTheDocument();
    expect(screen.getByText("Monthly spend")).toBeInTheDocument();
  });

  it("adds a product through the inventory dialog", async () => {
    const user = userEvent.setup();
    render(<SupplyPilot />);

    await user.click(screen.getByRole("button", { name: /add inventory item/i }));
    await user.type(screen.getByLabelText("Product name"), "Mavrodaphne Reserve");
    await user.type(screen.getByLabelText("SKU"), "WIN-MAV-750");
    await user.type(screen.getByLabelText("Supplier"), "Patras Cellars");
    await user.click(screen.getByRole("button", { name: /add to inventory/i }));

    expect(screen.getByText("Mavrodaphne Reserve added to inventory")).toBeInTheDocument();
    expect(screen.getByText("Mavrodaphne Reserve")).toBeInTheDocument();
  });
});
