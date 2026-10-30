type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

type StatusBadgeProps = {
  label: string;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-700",
};

export function StatusBadge({
  label,
  variant = "neutral",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full px-2.5 py-1
        text-xs font-medium
        whitespace-nowrap
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
