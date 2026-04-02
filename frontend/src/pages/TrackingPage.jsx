import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const TrackingPage = () => {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    const load = () => api.get(`/orders/${orderId}/tracking`).then(({ data }) => setTracking(data));
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!tracking) {
    return <div className="shell py-20 text-center">Loading tracking...</div>;
  }

  return (
    <div className="shell py-10">
      <div className="mx-auto max-w-3xl card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Live order tracking</p>
        <h1 className="mt-3 font-display text-3xl font-bold capitalize">{tracking.currentStatus.replaceAll("_", " ")}</h1>
        <div className="mt-10 space-y-6">
          {tracking.timeline.map((step, index) => (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`h-4 w-4 rounded-full ${step.completed ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                {index < tracking.timeline.length - 1 ? (
                  <div className={`mt-2 h-16 w-px ${step.completed ? "bg-brand-300" : "bg-slate-200 dark:bg-slate-800"}`} />
                ) : null}
              </div>
              <div>
                <p className="font-semibold">{step.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(step.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
