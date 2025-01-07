"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/adminOrderAction";
import { ORDER_SEQUENCE } from "@/constant/order";

interface OrderActionsProps {
  orderId: number;
  page: number;
  status: string;
}

export default function OrderActions({
  orderId,
  page,
  status,
}: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const currentIndex = ORDER_SEQUENCE.map((e) => e.action).indexOf(status);
  const isLastStatus = currentIndex === ORDER_SEQUENCE.length - 1;

  const handleAction = (action: string) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, action, page);
        alert(`Order ${action} successfully!`);
      } catch (error: any) {
        alert(`Failed to ${action} order: ${error.message}`);
      }
    });
  };

  const showStatus =
    currentIndex === 0
      ? ORDER_SEQUENCE[0]
      : isLastStatus
      ? ORDER_SEQUENCE[ORDER_SEQUENCE.length - 1]
      : ORDER_SEQUENCE[currentIndex + 1];

  return (
    <div className="flex gap-2">
      <Button
        className="w-24"
        onClick={() => handleAction(showStatus.action)}
        disabled={isPending || isLastStatus || currentIndex === 0}
        variant="outline"
      >
        {showStatus.status}
      </Button>
      <Button
        onClick={() => handleAction("reject")}
        disabled={isPending || isLastStatus || currentIndex === 0}
        variant="destructive"
      >
        Reject
      </Button>
    </div>
  );
}
