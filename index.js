const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT = 3055;

mongoose
  .connect("mongodb://127.0.0.1:27017/dec-order-management")
  .then((db) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("something went wrong", err);
  });

app.use(cors());
app.use(express.json());

// Schema Definition
const { Schema } = mongoose;
const menuItemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ["food", "drink"] },
  amount: { type: Number, min: 1, required: true },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

const orderSchema = new Schema({
  menuItemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "MenuItem",
  },
  status: {
    type: String,
    required: true,
    default: "placed",
    enum: ["placed", "fulfilled"],
  },
});

const Order = mongoose.model("Order", orderSchema);

// list all menu items
app.get("/api/menu-items", (req, res) => {
  MenuItem.find()
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      res.json(err);
    });
});

// create a menu item
app.post("/api/menu-item", (req, res) => {
  const { body } = req;
  const menuItem = new MenuItem(body);
  menuItem
    .save()
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json(err);
    });
});

// seach menu item
app.get("/api/search", (req, res) => {
  const { text } = req.query;
  MenuItem.find({ name: { $regex: text, $options: "i" } })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json(err);
    });
});

// update menu item
app.put("/api/menu-items", (req, res) => {
  res.send("welcome to my website");
  const { id } = req.query;
  const { body } = req;
  const odersItem = new Order(body);
  odersItem
    .save(id, body)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete item
app.get("/api/menu-item", (req, res) => {
  res.send("welcome to my website");
  const { id } = req.query;
  MenuItem.findByIdAndDelete(id)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json(err);
    });
});

// list all placed orders
app.get("/api/orders", (req, res) => {
  Order.find({ status: "placed" })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json(err);
    });
});

// create an order
app.post("/api/orders", (req, res) => {
  const { body } = req;
  const order = new Order(body);
  order
    .save()
    .then((order) => {
      res.json(order);
    })
    .catch((err) => {
      res.json(err);
    });
});

// fulfil an order
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  Order.findByIdAndUpdate(id, { status: "fulfilled" }, { new: true })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
