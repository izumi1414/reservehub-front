import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { updateUserPassword } from "../api";
import { ApiError } from "~/lib/api/errors";

export function PasswordEditForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("すべての項目を入力してください。");
      return;
    }

    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上で入力してください。");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("新パスワードと新パスワード(確認用)が一致しません。もう一度確認してください。");
      return;
    }

    if (currentPassword === newPassword) {
      setError("現在のパスワードと同じパスワードには変更できません。");
      return;
    }

    if (!window.confirm("パスワードの変更をしてよろしいですか？")) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await updateUserPassword({ currentPassword, newPassword });
      navigate("/account", { replace: true });
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            setError("入力内容が不正です。新しいパスワードは8文字以上で入力してください。");
            break;
          case 401:
            setError("現在のパスワードが一致しません。");
            break;
          case 500:
            setError("サーバー内部エラーが発生しました。しばらくしてから再度お試しください。");
            break;
          default:
            setError("パスワードの変更に失敗しました。");
        }
      } else {
        setError("パスワードの変更に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-800">
          パスワード
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="max-w-xl space-y-4">
          <Input
            id="current-password"
            name="current-password"
            label="現在のパスワード"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            isRequired
            autoComplete="current-password"
          />
          <Input
            id="new-password"
            name="new-password"
            label="新パスワード(8文字以上)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            isRequired
            autoComplete="new-password"
            minLength={8}
          />
          <Input
            id="new-confirm-password"
            name="new-confirm-password"
            label="新パスワード(確認用)"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            isRequired
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/account"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!currentPassword || !newPassword || !confirmNewPassword || isLoading}
          >
            変更
          </Button>
        </div>
      </form>
    </section>
  );
}
