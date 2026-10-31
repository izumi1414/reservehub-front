import { Outlet } from "react-router";
import { AdminSidebar } from "./adminSidebar";
import { Header } from "../shared/Header";

export function AdminLayout() {
  const handleLogout = () => {
    // TODO: ログアウト処理を実装
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar />

      {/* メインエリア */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 共通ヘッダー */}
        <Header
          userName="管理者"
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
