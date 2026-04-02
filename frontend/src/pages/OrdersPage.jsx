import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const OrdersPage = ({ orders }) => (
  <div className="shell space-y-5 py-10">
    <div className="card p-6">
      <h1 className="font-display text-3xl font-bold">Order history</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track instant and scheduled deliveries from one place.</p>
    </div>
    {orders.map((order) => (
      <div key={order._id} className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{order.status.replaceAll("_", " ")}</p>
            <h2 className="mt-1 text-xl font-semibold">{formatCurrency(order.total)}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <Link to={`/orders/${order._id}/tracking`} className="btn-secondary">
            Track order
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {order.items.map((item) => (
            <div key={item.product} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.quantity} x {item.weight}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default OrdersPage;
