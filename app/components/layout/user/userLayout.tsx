import { Outlet } from "react-router";
import { UserSidebar } from "./userSidebar";
import { Header } from "../shared/Header";

export function UserLayout() {
  const handleLogout = () => {
    // TODO: ログアウト処理を実装
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
