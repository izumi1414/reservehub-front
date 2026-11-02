import { Outlet, useNavigate, Navigate } from "react-router";
import { UserSidebar } from "./userSidebar";
import { Header } from "../shared/Header";
import { useAuth } from "~/features/auth/useAuth";

export function UserLayout() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  
  // 認証状態の確認中
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 未ログインの場合
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <UserSidebar />

      {/* メインエリア */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 共通ヘッダー */}
        <Header
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
