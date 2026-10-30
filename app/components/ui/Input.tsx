import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
};

export function Input({
  label,
  error,
  helperText,
  isRequired = false,
  id,
  className = "",
  disabled = false,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  const messageId = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {isRequired && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={messageId}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          text-gray-900 placeholder:text-gray-400
          outline-none transition-colors
          focus:ring-2
          disabled:cursor-not-allowed disabled:bg-gray-100
          disabled:text-gray-500
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p
          id={messageId}
          className="text-xs text-red-600"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={messageId}
          className="text-xs text-gray-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
