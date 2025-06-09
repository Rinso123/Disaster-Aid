import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import Offer from '../models/offer.model.js';
import bcrypt from 'bcryptjs';


export async function initAdmin() {
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("Creating admin user");
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, await bcrypt.genSalt(10));
    const data = {
      name: "Admin",
      email: "admin@admin.com",
      password: hash,
      location: { type: 'Point', coordinates: [0, 0] },
      role: "admin"
    }
    await User.create(data);
  }
}


export async function getRequests(req, res) {

  const requests = await Request.find().populate([
    { path: "user" },
    { path: "provider" },
  ]);

  res.render("pages/admin/requests", { requests, user: req.user });
}

export async function deleteRequest(req, res) {
  await Request.findOneAndDelete({ _id: req.params.id });

  res.redirect("/admin/requests");
}


export async function getOffers(req, res) {

  const offers = await Offer.find().populate([
    { path: "provider" },
    { path: "receiver" }
  ]);

  res.render("pages/admin/offers", { offers, user: req.user });
}

export async function deleteOffer(req, res) {
  await Offer.findOneAndDelete({ _id: req.params.id });

  res.redirect("/admin/offers");
}


export async function getUsers(req, res) {

  const users = await User.find().lean();

  res.render("pages/admin/users", { users, user: req.user });
}

export async function deleteUser(req, res) {

  await User.findOneAndDelete({ _id: req.params.id });

  res.redirect("/admin/users");
}
