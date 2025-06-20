"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const weeklyData = [
  { week: "Week 1", earnings: 1200 },
  { week: "Week 2", earnings: 1800 },
  { week: "Week 3", earnings: 1400 },
  { week: "Week 4", earnings: 2200 },
  { week: "Week 5", earnings: 1900 },
  { week: "Week 6", earnings: 2400 },
];

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const generateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setAiSummary(
        "This month shows strong performance with £2,400 in total earnings, representing a 15% increase from last month. Your top service, Whitening treatments, contributed £1,200 to revenue. Consider following up on the 4 unpaid invoices to improve cash flow."
      );
      setIsGenerating(false);
    }, 2000);
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
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>3 invoices are overdue</strong> (more than 14 days) - Consider
          following up with patients.
        </AlertDescription>
      </Alert>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Earned This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">£2,400</div>
            <p className="text-xs text-slate-500 mt-1">+15% from last month</p>
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
              <div className="text-3xl font-bold text-slate-900">4</div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              £680 total outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Top Service
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Whitening</div>
            <p className="text-sm text-blue-600 font-medium">£1,200 revenue</p>
            <p className="text-xs text-slate-500 mt-1">
              12 treatments this month
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
              <BarChart data={weeklyData}>
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
            onClick={generateSummary}
            disabled={isGenerating}
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
