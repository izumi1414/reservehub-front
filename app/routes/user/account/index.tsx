import { AccountInfoCard } from "~/features/account/components/AccountInfoCard"
import { deleteUser, getUserProfile } from "~/features/account/api";
import { useEffect, useState } from "react";
import type { UserProfile } from "~/features/account/types";
import { Button } from "~/components/ui/Button";
import { useNavigate } from "react-router";
import { useAuth } from "~/features/auth/useAuth";

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleDeleteUser() {
    if (!window.confirm("アカウントを削除してよろしいですか？")){
      return;
    }

    setError("");
    setIsDeleting(true);
    try {
      await deleteUser();
      logout();
      navigate("/login", { replace: true });
    } catch(err) {
      console.error(err);
      setError("アカウントの削除に失敗しました")
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await getUserProfile();
        setUserProfile(res);
      } catch (err) {
        console.error(err);
        setError("ユーザー情報の取得に失敗しました")
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserProfile();
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
          ユーザー情報を読み込んでいます...
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          ユーザー情報を表示できません
        </h1>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() => navigate("/reservations")}
          >
            戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">アカウント設定</h1>
        <p className="mt-1 text-sm text-gray-500">
          登録情報やログイン情報を確認・変更できます。
        </p>
      </div>
      <AccountInfoCard
        profile={userProfile}
        onEmailEdit={() => navigate("/account/email-edit")}
        onPasswordEdit={() => navigate("/account/password-edit")} />
      {error && (
        <p className="text-right text-sm text-red-500">{error}</p>
      )}
      <div className="flex justify-end">
        <Button
          variant="danger"
          disabled={isDeleting}
          isLoading={isDeleting}
          onClick={handleDeleteUser}
        >
          アカウントの削除
        </Button>
      </div>
    </div>
  );
}
