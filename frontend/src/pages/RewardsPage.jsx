const RewardsPage = ({ rewards }) => (
  <div className="shell py-10">
    <div className="mx-auto max-w-3xl card overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-8 text-slate-950">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-900/75">Rewards and loyalty</p>
      <h1 className="mt-3 font-display text-4xl font-bold">{rewards.loyaltyPoints} points</h1>
      <p className="mt-2 max-w-lg text-sm text-slate-900/80">
        You earn 1 point for roughly every Rs.20 spent. Reach {rewards.nextRewardAt} points to unlock your next milestone reward.
      </p>
    </div>
  </div>
);

export default RewardsPage;
