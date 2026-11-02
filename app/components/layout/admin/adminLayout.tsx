import { Outlet, useNavigate, Navigate } from "react-router";
import { AdminSidebar } from "./adminSidebar";
import { Header } from "../shared/Header";
import { useAuth } from "~/features/auth/useAuth";

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  // 認証状態の確認中
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 未ログインの場合
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 管理者以外の場合
  if (user.role !== "admin") {
    return <Navigate to="/reservations" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar />

      {/* メインエリア */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 共通ヘッダー */}
        <Header
          userName={user?.role === "admin" ? "管理者" : undefined}
          onLogout={handleLogout}
        />

        {/* ページコンテンツ */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
