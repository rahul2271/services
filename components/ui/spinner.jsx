import React from "react";

const Spinner = ({ size = "24px", color = "currentColor", className }) => (
  <svg
    className={`animate-spin ${className || ""}`}
    style={{ width: size, height: size }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill={color}
      d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.291A7.978 7.978 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export { Spinner };
