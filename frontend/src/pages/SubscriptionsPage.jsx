import { Repeat2 } from "lucide-react";

const SubscriptionsPage = ({ subscriptions }) => (
  <div className="shell space-y-5 py-10">
    <div className="card p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Recurring orders</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Subscriptions</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Automate daily or weekly essentials like milk, bread, and eggs.</p>
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {subscriptions.map((subscription) => (
        <div key={subscription._id} className="card p-5">
          <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-900/40">
            <Repeat2 className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-semibold">{subscription.product?.name}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subscription.quantity} item(s) • {subscription.frequency} • {subscription.preferredSlot}
          </p>
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/60">
            Next delivery: {new Date(subscription.nextDeliveryDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default SubscriptionsPage;
