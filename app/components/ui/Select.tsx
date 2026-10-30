import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  placeholder?: string;
};

export function Select({
  label,
  options,
  error,
  helperText,
  isRequired = false,
  placeholder,
  id,
  name,
  className = "",
  disabled = false,
  ...props
}: SelectProps) {
  const selectId = id ?? name;

  const messageId = error
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {isRequired && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        disabled={disabled}
        required={isRequired || props.required}
        aria-invalid={!!error}
        aria-describedby={messageId}
        className={`
          w-full rounded-md border px-3 py-2
          text-sm text-gray-900
          outline-none transition-colors
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:bg-gray-100 disabled:text-gray-500
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

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
