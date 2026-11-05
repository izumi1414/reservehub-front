import { PageHeader } from "~/components/layout/shared/PageHeader";
import { MonthlyReport } from "~/features/monthly-report/components/MonthlyReport";

export default function MonthlyReportPage() {
  return (
    <div>
      <PageHeader
        title="月次レポート"
        description="対象月の予約件数とステータス別件数を確認できます。"
      />
      <MonthlyReport />
    </div>
  );
}
