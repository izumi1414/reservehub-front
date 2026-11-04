import { PageHeader } from "~/components/layout/shared/PageHeader";
import { SlotForm } from "~/features/admin-slots/components/SlotForm";

export default function NewSlotPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="予約枠作成" description="新しい予約枠の開始・終了日時を入力してください。" />
      <SlotForm />
    </div>
  );
}
