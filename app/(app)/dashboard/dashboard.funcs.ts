import { Payment, Service } from "@/lib/generated/prisma/client";

export const getTotalEarnings = (payments: Payment[], services: Service[]) => {
  return payments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => {
      const service = services.find((s) => s.id === p.serviceId);
      return sum + (service?.price || 0);
    }, 0);
};

export const getUnpaidInvoices = (payments: Payment[]) => {
  return payments.filter((p) => !p.isPaid);
};

export const getOverdueInvoices = (unpaidInvoices: Payment[]) => {
  return unpaidInvoices.filter((p) => {
    const daysSince =
      (new Date().getTime() - new Date(p.date).getTime()) /
      (1000 * 60 * 60 * 24);
    return daysSince > 14;
  });
};

export const getMostPopularService = (
  payments: Payment[],
  services: Service[]
) => {
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
};

export const getMostProfitableService = (
  payments: Payment[],
  services: Service[]
) => {
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
};

export const getLastSixWeeklyEarnings = (
  payments: Payment[],
  services: Service[]
) => {
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
};
