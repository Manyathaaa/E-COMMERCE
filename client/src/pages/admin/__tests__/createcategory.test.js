import { render, screen, fireEvent } from "@testing-library/react";
import CreateCategory from "../createcategory";

describe("CreateCategory", () => {
  test("renders category form and validates required field", () => {
    render(<CreateCategory />);
    const input = screen.getByPlaceholderText(/enter category name/i);
    const button = screen.getByRole("button", { name: /create category/i });
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);
    expect(screen.getByText(/category name is required/i)).toBeInTheDocument();
  });
});
