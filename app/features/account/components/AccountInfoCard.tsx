import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/Button";
import type { UserProfile } from "../types";

interface Props {
  profile: UserProfile;
  onEmailEdit: () => void;
  onPasswordEdit: () => void;
}

export const AccountInfoCard = ({ profile, onEmailEdit, onPasswordEdit }: Props) => {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-800">
          基本情報
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="grid gap-3 px-5 py-5 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <span className="text-sm font-medium text-gray-500">
            メールアドレス
          </span>
          <span className="break-all text-sm font-medium text-gray-600">
            {profile.email}
          </span>
          <Button
            variant="secondary"
            onClick={onEmailEdit}
            size="sm"
            className="justify-self-start border-slate-200 text-gray-700 sm:justify-self-end"
          >
            <Pencil size={16} />
            編集する
          </Button>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <span className="text-sm font-medium text-gray-500">
            パスワード
          </span>
          <span className="text-sm font-medium tracking-[0.35em] text-gray-600">
            ●●●●●●●●
          </span>
          <Button
            variant="secondary"
            onClick={onPasswordEdit}
            size="sm"
            className="justify-self-start border-slate-200 text-gray-700 sm:justify-self-end"
          >
            <Pencil size={16} />
            編集する
          </Button>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <span className="text-sm font-medium text-gray-500">
            ユーザーID
          </span>
          <span className="break-all text-sm font-medium text-gray-600">
            {profile.id}
          </span>
          <span aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default AccountInfoCard;
