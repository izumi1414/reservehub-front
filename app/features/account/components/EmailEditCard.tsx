import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { updateUserEmail } from "../api";
import { ApiError } from "~/lib/api/errors";

export function EmailEditForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("メールアドレスを入力してください。");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError("メールアドレスの形式が正しくありません。");
      return;
    }

    if (!window.confirm("メールアドレスの変更をしてよろしいですか？")) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await updateUserEmail({ email: normalizedEmail });
      navigate("/account", { replace: true });
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            setError("入力内容またはメールアドレスの形式が正しくありません。");
            break;
          case 409:
            setError("このメールアドレスは既に使用されています");
            break;
          case 500:
            setError("サーバー内部エラーが発生しました。しばらくしてから再度お試しください。");
            break;
          default:
            setError("メールアドレスの変更に失敗しました。");
        }
      } else {
        setError("メールアドレスの変更に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-800">
          メールアドレス
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="max-w-xl">
          <Input
            id="new-email"
            name="new-email"
            label="新メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            isRequired
            autoComplete="email"
            helperText="ログイン時に使用するメールアドレスです。"
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
            disabled={!email.trim() || isLoading}
          >
            変更
          </Button>
        </div>
      </form>
    </section>
  );
}
