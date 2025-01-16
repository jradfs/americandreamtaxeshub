import { render, screen } from "@testing-library/react";
import { AuthLoading, AuthLoadingInline } from "../auth-loading";

describe("AuthLoading", () => {
  it("renders with default message", () => {
    render(<AuthLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const message = "Custom loading message";
    render(<AuthLoading message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("has full screen height", () => {
    render(<AuthLoading />);
    expect(document.querySelector(".min-h-screen")).toBeInTheDocument();
  });
});

describe("AuthLoadingInline", () => {
  it("renders with default message", () => {
    render(<AuthLoadingInline />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const message = "Custom loading message";
    render(<AuthLoadingInline message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("has smaller spinner than full AuthLoading", () => {
    const { rerender } = render(<AuthLoading />);
    const fullSpinner = document.querySelector(".animate-spin");

    rerender(<AuthLoadingInline />);
    const inlineSpinner = document.querySelector(".animate-spin");

    expect(fullSpinner?.classList.contains("h-12")).toBeTruthy();
    expect(inlineSpinner?.classList.contains("h-6")).toBeTruthy();
  });

  it("has inline layout", () => {
    render(<AuthLoadingInline />);
    const container = document.querySelector(".flex");
    expect(container?.classList.contains("min-h-screen")).toBeFalsy();
  });
});
