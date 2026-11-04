import { useParams } from "react-router";
import { PageHeader } from "~/components/layout/shared/PageHeader";
import { SlotForm } from "~/features/admin-slots/components/SlotForm";

export default function EditSlotPage() {
  const { slotId } = useParams();
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="予約枠編集" description="予約枠の日時または受付状態を変更できます。" />
      {slotId ? (
        <SlotForm slotId={slotId} />
      ) : (
        <p className="text-sm text-red-500">予約枠IDを取得できませんでした。</p>
      )}
    </div>
  );
}
