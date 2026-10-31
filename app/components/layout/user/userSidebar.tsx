import { NavLink } from "react-router";
import {
  CalendarDays,
  ClipboardList,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    label: "予約する",
    path: "/reservations",
    icon: CalendarDays,
    end: true,
  },
  {
    label: "自分の予約一覧",
    path: "/my/reservations",
    icon: ClipboardList,
  },
  {
    label: "会員情報",
    path: "/account",
    icon: UserRound,
  },
];

export function UserSidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-sky-100 bg-sky-50">
      {/* Logo */}
      <div className="
        flex h-16 items-center gap-2
        border-b border-sky-100 px-5
      ">
        <CalendarDays className="h-6 w-6 text-sky-600" />

        <span className="text-lg font-bold text-slate-800">
          ReserveHub
        </span>
      </div>


      {/* メニュー */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-sky-100 hover:text-sky-700"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
