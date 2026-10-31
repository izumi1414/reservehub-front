import { LogOut } from "lucide-react";
import { Button } from "~/components/ui/Button";

type HeaderProps = {
  userName?: string;
  onLogout?: () => void;
};

export function Header({
  userName,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-sky-100 bg-sky-50 px-8">
      <div className="flex items-center gap-4">
        {userName && (
          <span className="text-sm text-gray-700">
            {userName}
          </span>
        )}

        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="mr-0 h-4 w-4" />
            ログアウト
          </Button>
        )}
      </div>
    </header>
  );
}
