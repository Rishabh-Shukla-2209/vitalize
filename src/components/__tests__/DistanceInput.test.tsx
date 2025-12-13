import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { DistanceInput } from "../DistanceInput";

describe("DistanceInput Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders correctly with initial 0 value", () => {
    render(<DistanceInput onChange={mockOnChange} value={0} />);

    const kmInput = screen.getByPlaceholderText("0");
    const mInput = screen.getByPlaceholderText("000");

    expect(kmInput).toHaveValue(null); // value={kilometers === 0 ? "" : kilometers}
    expect(mInput).toHaveValue(null); // value={meters === 0 ? "" : ...}
  });

  it("renders correctly with provided value", () => {
    // 1500 meters = 1 km 500 m
    render(<DistanceInput onChange={mockOnChange} value={1500} />);

    const kmInput = screen.getByPlaceholderText("0");
    const mInput = screen.getByPlaceholderText("000");

    expect(kmInput).toHaveValue(1);
    expect(mInput).toHaveValue(500);
  });

  it("calls onChange when kilometers change", () => {
    render(<DistanceInput onChange={mockOnChange} value={500} />); // 0km 500m

    const kmInput = screen.getByPlaceholderText("0");
    fireEvent.change(kmInput, { target: { value: "2" } });

    // 2 km + 500 m = 2500
    expect(mockOnChange).toHaveBeenCalledWith(2500);
  });

  it("calls onChange when meters change", () => {
    render(<DistanceInput onChange={mockOnChange} value={1000} />); // 1km 0m

    const mInput = screen.getByPlaceholderText("000");
    fireEvent.change(mInput, { target: { value: "250" } });

    // 1 km + 250 m = 1250
    expect(mockOnChange).toHaveBeenCalledWith(1250);
  });
});
