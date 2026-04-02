import { Subscription } from "../models/Subscription.js";
import { demoStore } from "../utils/demoStore.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";

export const getSubscriptions = async (req, res) => {
  if (isFirebaseMode()) {
    const subscriptions = await firebaseStore.getSubscriptions(req.user._id);
    return res.json(subscriptions);
  }

  if (isDemoMode()) {
    return res.json(await demoStore.getSubscriptions(req.user._id));
  }

  const subscriptions = await Subscription.find({ user: req.user._id }).populate("product");
  res.json(subscriptions);
};

export const createSubscription = async (req, res) => {
  if (isFirebaseMode()) {
    const subscription = await firebaseStore.createSubscription({
      user: req.user._id,
      ...req.body
    });

    return res.status(201).json(subscription);
  }

  if (isDemoMode()) {
    return res.status(201).json({
      _id: `demo-subscription-${Date.now()}`,
      ...req.body,
      active: true
    });
  }

  const subscription = await Subscription.create({
    user: req.user._id,
    ...req.body
  });

  res.status(201).json(await subscription.populate("product"));
};

export const updateSubscription = async (req, res) => {
  if (isFirebaseMode()) {
    const subscription = await firebaseStore.updateSubscription(req.params.subscriptionId, req.body);

    if (!subscription || subscription.user !== req.user._id) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json(subscription);
  }

  if (isDemoMode()) {
    return res.json({ _id: req.params.subscriptionId, ...req.body });
  }

  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.subscriptionId, user: req.user._id },
    req.body,
    { new: true }
  ).populate("product");

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  res.json(subscription);
};
