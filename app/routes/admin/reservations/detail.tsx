import { PageHeader } from "~/components/layout/shared/PageHeader";
import { AdminReservationDetail } from "~/features/admin-reservations/components/AdminReservationDetail";

export default function AdminReservationDetailPage() {
  return (
    <div>
      <PageHeader title="予約詳細" description="予約者情報と予約枠の日時を確認できます。" />
      <AdminReservationDetail />
    </div>
  );
}
