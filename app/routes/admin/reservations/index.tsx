import { PageHeader } from "~/components/layout/shared/PageHeader";
import { AdminReservationList } from "~/features/admin-reservations/components/AdminReservationList";

export default function AdminReservationsPage() {
  return (
    <div>
      <PageHeader
        title="予約一覧"
        description="確定済み・キャンセル済みを含む予約履歴を確認できます。"
      />
      <AdminReservationList />
    </div>
  );
}
