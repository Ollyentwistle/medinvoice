import {
  getMostPopularService,
  getMostProfitableService,
  getOverdueInvoices,
  getTotalEarnings,
  getUnpaidInvoices,
} from "@/app/(app)/dashboard/dashboard.funcs";
import { fetchAllPayments } from "@/app/api/payments/payments.funcs";
import { fetchAllServices } from "@/app/api/services/services.funcs";
import {
  addMonthlySummary,
  generateSummary,
} from "@/app/api/summary/summary.funcs";
import { inngest } from "@/lib/inngest";

export const monthlySummary = inngest.createFunction(
  { id: "generate-monthly-summary" },
  { cron: "TZ=UTC 0 0 28-31 * *" }, // run on the 28th-31st of each month
  async () => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const isLastDayOfMonth = tomorrow.getDate() === 1;

      if (!isLastDayOfMonth) {
        return { skipped: true }; // only run on the final each of the onth
      }

      const payments = await fetchAllPayments();
      const services = await fetchAllServices();

      const totalEarnings = getTotalEarnings(payments, services);

      const unpaidInvoices = getUnpaidInvoices(payments);
      const overdueInvoices = getOverdueInvoices(unpaidInvoices);

      const mostPopularServiceData = getMostPopularService(payments, services);

      const mostProfitableServiceData = getMostProfitableService(
        payments,
        services
      );

      const summary = await generateSummary({
        totalEarnings,
        mostPopularService: mostPopularServiceData
          ? {
              name: mostPopularServiceData.name,
              revenue: mostPopularServiceData.revenue,
              count: mostPopularServiceData.count,
              multiple: mostPopularServiceData.multiple || false,
            }
          : null,
        mostProfitableService: mostProfitableServiceData
          ? {
              name: mostProfitableServiceData.name,
              revenue: mostProfitableServiceData.revenue,
              count: mostProfitableServiceData.count,
              multiple: mostProfitableServiceData.multiple || false,
            }
          : null,
        unpaidCount: unpaidInvoices.length,
        overdueCount: overdueInvoices.length,
      });

      await addMonthlySummary(summary);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message ?? "Failed to generate summary",
      };
    }
  }
);
