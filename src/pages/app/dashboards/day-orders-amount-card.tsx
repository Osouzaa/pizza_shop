import { getDayOrderAmount } from "@/api/get-day-order-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";

export function DaysOrdersAmountCard() {
  const { data: dayOrderAmount } = useQuery({
    queryFn: getDayOrderAmount,
    queryKey: ["metrics", "day-orders-amount"],
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-x-0 pb-2">
        <CardTitle className="font-semiabold text-base">
          Pedidos (dia)
        </CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {dayOrderAmount && (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {dayOrderAmount.amount.toLocaleString("pt-BR")}
            </span>
            <p className="text-xs text-muted-foreground">
              {dayOrderAmount.diffFromYesterday >= 0 ? (
                <span className="text-emerald-500 dark:text-emerald-400">
                  +{dayOrderAmount.diffFromYesterday}%
                </span>
              ) : (
                <span className="text-rose-500 dark:text-rose-400">
                  {dayOrderAmount.diffFromYesterday}%
                </span>
              )}{" "}
              em relação ao dia passado
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
