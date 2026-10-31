import { NavLink } from "react-router";
import {
  CalendarDays,
  ClipboardList,
  ChartColumn,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "予約枠管理",
    path: "/admin",
    icon: CalendarDays,
    end: true,
  },
  {
    label: "予約一覧",
    path: "/admin/reservations",
    icon: ClipboardList,
  },
  {
    label: "月別集計",
    path: "/admin/reports/monthly",
    icon: ChartColumn,
  },
];

export function AdminSidebar() {
  return (
    <aside className="
      flex h-screen w-60 shrink-0 flex-col
      border-r border-sky-100 bg-sky-50
    ">
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center gap-3
                    rounded-md px-3 py-2.5
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:bg-sky-100/70 hover:text-sky-700"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
