"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CreditCard,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { fetchPayments } from "../payments/payments.queries";
import { fetchServices } from "../services/services.queries";
import { generateSummary } from "./dashboard.queries";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const { user } = useUser();

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const totalEarnings = payments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => {
      const service = services.find((s) => s.id === p.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const unpaidInvoices = payments.filter((p) => !p.isPaid);
  const overdueInvoices = unpaidInvoices.filter((p) => {
    const daysSince =
      (new Date().getTime() - new Date(p.date).getTime()) /
      (1000 * 60 * 60 * 24);
    return daysSince > 14;
  });

  const mostPopularServiceData = (() => {
    const countMap: Record<number, number> = {};
    payments.forEach((p) => {
      if (p.isPaid) countMap[p.serviceId] = (countMap[p.serviceId] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(countMap), 0);
    if (maxCount === 0) return null; // no paid payments

    const topIds = Object.entries(countMap)
      .filter(([, count]) => count === maxCount)
      .map(([serviceId]) => Number(serviceId));

    const topServices = services.filter((s) => topIds.includes(s.id));

    if (topServices.length === 0) return null;

    const name =
      topServices.length === 1
        ? topServices[0].name
        : topServices.map((s) => s.name).join(" & ");

    const revenue = topServices.reduce((total, service) => {
      const serviceRevenue = payments
        .filter((p) => p.serviceId === service.id && p.isPaid)
        .reduce((sum, p) => sum + (service.price || 0), 0);
      return total + serviceRevenue;
    }, 0);

    return {
      name,
      revenue,
      count: maxCount,
      multiple: topServices.length > 1,
    };
  })();

  const mostProfitableServiceData = (() => {
    const revenueMap: Record<number, number> = {};

    payments.forEach((p) => {
      if (p.isPaid) {
        const service = services.find((s) => s.id === p.serviceId);
        if (service) {
          revenueMap[p.serviceId] =
            (revenueMap[p.serviceId] || 0) + (service.price || 0);
        }
      }
    });

    const maxRevenue = Math.max(...Object.values(revenueMap), 0);
    if (maxRevenue === 0) return null; // no revenue

    const topIds = Object.entries(revenueMap)
      .filter(([, revenue]) => revenue === maxRevenue)
      .map(([serviceId]) => Number(serviceId));

    const topServices = services.filter((s) => topIds.includes(s.id));
    if (topServices.length === 0) return null;

    const name =
      topServices.length === 1
        ? topServices[0].name
        : topServices.map((s) => s.name).join(" & ");

    // Total count of paid treatments for all tied top services
    const count = topServices.reduce((total, service) => {
      return (
        total +
        payments.filter((p) => p.serviceId === service.id && p.isPaid).length
      );
    }, 0);

    return {
      name,
      revenue: maxRevenue,
      count,
      multiple: topServices.length > 1,
    };
  })();

  // Weekly earnings (last 6 weeks)
  const weeklyEarnings = (() => {
    const result: { week: string; earnings: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const earnings = payments
        .filter((p) => {
          const d = new Date(p.date);
          return p.isPaid && d >= start && d <= end;
        })
        .reduce((sum, p) => {
          const s = services.find((s) => s.id === p.serviceId);
          return sum + (s?.price || 0);
        }, 0);

      result.push({
        week: `Week ${6 - i}`,
        earnings,
      });
    }

    return result;
  })();

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
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

    setAiSummary(summary);
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back! Here's your clinic overview.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {overdueInvoices.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>
              {overdueInvoices.length} invoice
              {overdueInvoices.length > 1 ? "s" : ""} are overdue
            </strong>
            (more than 14 days) – Consider following up with patients.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Earned This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              £{totalEarnings}
            </div>
            {/* <p className="text-xs text-slate-500 mt-1">+15% from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Unpaid Invoices
            </CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {unpaidInvoices.length}
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              £
              {unpaidInvoices.reduce((sum, p) => {
                const s = services.find((s) => s.id === p.serviceId);
                return sum + (s?.price || 0);
              }, 0)}{" "}
              total outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Most Profitable Service
              {mostProfitableServiceData?.multiple ? "s" : ""}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {mostProfitableServiceData?.name ?? "—"}
            </div>
            <p className="text-sm text-blue-600 font-medium">
              £{mostProfitableServiceData?.revenue ?? 0} revenue
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {mostPopularServiceData?.count && !mostPopularServiceData.multiple
                ? `From ${mostPopularServiceData?.count} treatments this month`
                : ""}
              {mostPopularServiceData?.multiple && "Earned each this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Most Popular Service{mostPopularServiceData?.multiple ? "s" : ""}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {mostPopularServiceData?.name ?? "—"}
            </div>
            <p className="text-sm text-blue-600 font-medium">
              £{mostPopularServiceData?.revenue ?? 0} revenue
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {mostPopularServiceData?.count ?? 0} treatments
              {mostPopularServiceData?.multiple ? "each" : ""} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Earnings</CardTitle>
          <CardDescription>
            Revenue trends over the past 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              earnings: {
                label: "Earnings",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEarnings}>
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* AI Insight Box */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Get intelligent analysis of your clinic's performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGenerateSummary}
            disabled={(isGenerating || !!aiSummary) && user?.role != "admin"}
            className="w-full bg-blue-600 hover:bg-blue-500 sm:w-auto"
          >
            {isGenerating
              ? "Generating Summary..."
              : "Generate Monthly Summary"}
          </Button>

          {aiSummary && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">{aiSummary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
