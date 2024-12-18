import { getMonthOrdersAmount } from "@/api/get-month-orders-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";

export function MonthOrdersAmountCard() {
  const { data: monthOrderAmount } = useQuery({
    queryFn: getMonthOrdersAmount,
    queryKey: ["metrics", "month-orders-amount"],
  });
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-x-0 pb-2">
        <CardTitle className="font-semiabold text-base">
          Pedidos (mês)
        </CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {monthOrderAmount && (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {monthOrderAmount.amount.toLocaleString("pt-BR")}
            </span>
            <p className="text-xs text-muted-foreground">
              {monthOrderAmount.diffFromLastMonth >= 0 ? (
                <span className="text-emerald-500 dark:text-emerald-400">
                  +{monthOrderAmount.diffFromLastMonth}%
                </span>
              ) : (
                <span className="text-rose-500 dark:text-rose-400">
                  -{monthOrderAmount.diffFromLastMonth}%
                </span>
              )}{" "}
              em relação ao mês passado
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
