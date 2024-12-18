import { approveOrder } from "@/api/approve-order";
import { cancelOrder } from "@/api/cancel-order";
import { deliveryOrder } from "@/api/deliver-order";
import { dispatchOrder } from "@/api/dispatch-order";
import type { GetOrdersResponse } from "@/api/get-oders";
import { OrderStatus } from "@/components/order-status";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { OrderDetails } from "./order-details";

interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  };
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ["orders"],
    });

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return;
      }
      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status,
            };
          }
          return order;
        }),
      });
    });
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "canceled");
      },
    });

  const { mutateAsync: approveOrderFn, isPending: isAprrovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "processing");
      },
    });

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "delivering");
      },
    });

  const { mutateAsync: deliveryOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliveryOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "delivered");
      },
    });

  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes do pedido</span>
              </Button>
            </DialogTrigger>

            <OrderDetails orderId={order.orderId} open={isDetailOpen} />
          </Dialog>
        </TableCell>
        <TableCell className="font-mono text-xs font-medium">
          {order.orderId}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {formatDistanceToNow(order.createdAt, {
            locale: ptBR,
            addSuffix: true,
          })}
        </TableCell>
        <TableCell>
          <OrderStatus status={order.status} />
        </TableCell>
        <TableCell className="font-medium">{order.customerName}</TableCell>
        <TableCell className="font-medium">
          {(order.total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </TableCell>
        <TableCell>
          {order.status === "pending" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => approveOrderFn({ orderId: order.orderId })}
              disabled={isAprrovingOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Aprovar
            </Button>
          )}
          {order.status === "processing" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => dispatchOrderFn({ orderId: order.orderId })}
              disabled={isDispatchingOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Em entrega
            </Button>
          )}

          {order.status === "delivering" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => deliveryOrderFn({ orderId: order.orderId })}
              disabled={isDeliveringOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Entregue
            </Button>
          )}
        </TableCell>
        <TableCell>
          <Button
            disabled={
              !["pending", "processing"].includes(order.status) ||
              isCancelingOrder
            }
            variant="ghost"
            size="xs"
            onClick={() => cancelOrderFn({ orderId: order.orderId })}
          >
            <X className="mr-2 h-3 w-3" />
            Cancelar
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
