import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Selector from "../Selector";

// Mock the radix-ui Select component parts since they rely on Context that might need specific setup or mocking
// However, typically testing-library works fine with them.
// If not, we might need a more integration-like approach or deep mocks.
// For now, let's try direct rendering.

// Radix UI often has issues in standard jsdom without pointer events polyfills or similar.
// But let's try a simple test first.

describe("Selector Component", () => {
  const mockSetChoice = vi.fn();
  const choices = [
    { label: "Option 1", val: "opt1" },
    { label: "Option 2", val: "opt2" },
  ];

  it("renders with placeholder", () => {
    render(
      <Selector
        choices={choices}
        setChoice={mockSetChoice}
        placeholder="Select something"
        selectedValue=""
      />,
    );
    expect(screen.getByText("Select something")).toBeInTheDocument();
  });

  it("displays selected value", () => {
    // When a value is selected, Radix UI display the text content associated with that value
    // but we passed it string 'opt1'. We need to check if the component renders the label properly.
    // Actually Selector component structure:
    // <Select value={selectedValue}> ... <SelectValue placeholder=...>
    // When value is set, Radix usually renders the children of SelectItem that matches.

    render(
      <Selector
        choices={choices}
        setChoice={mockSetChoice}
        placeholder="Select something"
        selectedValue="opt1"
      />,
    );
    // It should display 'Option 1'
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  // Interaction test might fail if Radix requires pointer-events or layout that jsdom fails at
  // We will see.
});
