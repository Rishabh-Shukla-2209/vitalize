import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DurationInput } from "../DurationInput";

describe("DurationInput", () => {
  it("renders with initial value", () => {
    render(<DurationInput value={130} onChange={() => {}} />); // 2 min 10 sec

    // Check for "2" in the minutes input using display value
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();

    // Check for "10" in the seconds input using display value
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("renders empty inputs for 0 value", () => {
    const { container } = render(
      <DurationInput value={0} onChange={() => {}} />,
    );
    const inputs = container.querySelectorAll("input");

    expect(inputs[0].value).toBe("");
    expect(inputs[1].value).toBe("");
  });

  it("calls onChange when minutes change", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <DurationInput value={0} onChange={handleChange} />,
    );
    const inputs = container.querySelectorAll(
      "input",
    ) as NodeListOf<HTMLInputElement>;

    fireEvent.change(inputs[0], { target: { value: "5" } });

    // 5 minutes * 60 = 300 seconds
    expect(handleChange).toHaveBeenCalledWith(300);
  });

  it("calls onChange when seconds change", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <DurationInput value={0} onChange={handleChange} />,
    );
    const inputs = container.querySelectorAll(
      "input",
    ) as NodeListOf<HTMLInputElement>;

    fireEvent.change(inputs[1], { target: { value: "30" } });

    expect(handleChange).toHaveBeenCalledWith(30);
  });

  it("calculates total duration correctly interacting with both inputs", () => {
    const handleChange = vi.fn();
    // Start with 1 min (60s)
    const { container } = render(
      <DurationInput value={60} onChange={handleChange} />,
    );
    const inputs = container.querySelectorAll(
      "input",
    ) as NodeListOf<HTMLInputElement>;

    // Change seconds to 30. Should be existing 1 min (60s) + new 30s?
    // Wait, the component implementation uses the *prop* value for the other field part calculation
    // So if props haven't updated, it uses the prop value (60) for minutes, which is 1.
    // So new seconds 30 -> 1 * 60 + 30 = 90.
    fireEvent.change(inputs[1], { target: { value: "30" } });

    expect(handleChange).toHaveBeenCalledWith(90);
  });
});
