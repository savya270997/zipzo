const steps = [
  { status: "placed", label: "Order placed" },
  { status: "confirmed", label: "Order confirmed" },
  { status: "picked", label: "Items picked" },
  { status: "on_the_way", label: "On the way" },
  { status: "delivered", label: "Delivered" }
];

export const buildTrackingTimeline = (createdAt) => {
  const start = new Date(createdAt).getTime();

  return steps.map((step, index) => ({
    ...step,
    timestamp: new Date(start + index * 8 * 60 * 1000)
  }));
};

export const getLiveTracking = (order) => {
  const timeline = order.timeline?.length ? order.timeline : buildTrackingTimeline(order.createdAt);
  const now = Date.now();
  const active = timeline.filter((item) => new Date(item.timestamp).getTime() <= now).at(-1);
  const currentStatus = active?.status || "placed";

  return {
    currentStatus,
    orderNumber: order.orderNumber,
    timeline: timeline.map((item) => ({
      ...item,
      completed: new Date(item.timestamp).getTime() <= now
    }))
  };
};
