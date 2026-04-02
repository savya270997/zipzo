import { User } from "../models/User.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const withIds = (addresses = []) =>
  addresses.map((address) => ({
    _id: address._id || `address-${randomUUID()}`,
    ...address
  }));

import { randomUUID } from "crypto";

export const getAddresses = async (req, res) => {
  if (isFirebaseMode()) {
    return res.json(req.user.addresses || []);
  }

  const user = await User.findById(req.user._id).select("addresses");
  res.json(user.addresses);
};

export const addAddress = async (req, res) => {
  if (isFirebaseMode()) {
    const current = withIds(req.user.addresses || []);
    const next = req.body.isDefault
      ? current.map((address) => ({ ...address, isDefault: false }))
      : current;
    const updated = [
      ...next,
      {
        _id: `address-${randomUUID()}`,
        ...req.body
      }
    ];

    const user = await firebaseStore.updateUser(req.user._id, { addresses: updated });
    return res.status(201).json(user.addresses);
  }

  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json(user.addresses);
};

export const updateAddress = async (req, res) => {
  if (isFirebaseMode()) {
    const current = withIds(req.user.addresses || []);
    const exists = current.some((address) => address._id === req.params.addressId);

    if (!exists) {
      return res.status(404).json({ message: "Address not found" });
    }

    let updated = current;
    if (req.body.isDefault) {
      updated = updated.map((address) => ({ ...address, isDefault: false }));
    }

    updated = updated.map((address) =>
      address._id === req.params.addressId ? { ...address, ...req.body, _id: address._id } : address
    );

    const user = await firebaseStore.updateUser(req.user._id, { addresses: updated });
    return res.json(user.addresses);
  }

  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  if (req.body.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();

  res.json(user.addresses);
};

export const deleteAddress = async (req, res) => {
  if (isFirebaseMode()) {
    const current = withIds(req.user.addresses || []);
    const exists = current.some((address) => address._id === req.params.addressId);

    if (!exists) {
      return res.status(404).json({ message: "Address not found" });
    }

    const updated = current.filter((address) => address._id !== req.params.addressId);
    const user = await firebaseStore.updateUser(req.user._id, { addresses: updated });
    return res.json(user.addresses);
  }

  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  address.deleteOne();
  await user.save();

  res.json(user.addresses);
};
