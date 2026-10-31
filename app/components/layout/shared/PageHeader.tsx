import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 px-2 py-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
