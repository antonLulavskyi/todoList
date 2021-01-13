//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connect to the todolistDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Creating a schema
const itemsSchema = {
  name: String
};
// Creating a model
const Item = mongoose.model("Item", itemsSchema);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// Default items
const cleanRoom = new Item({
  name: "Hit the + button to add new todo's"
});
const buyFood = new Item({
  name: "Press the checkbox to delete todo's"
});
const defaultItems = [cleanRoom, buyFood];


app.get("/", function(req, res) {

  // Populatin table with default data from DB if the table is empty
  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      // If database is not empty, then load the existing data
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});


app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox
  Item.findByIdAndRemove({_id: checkedItemId}, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
      console.log("Successfully removed item by _id: " + checkedItemId);
    }
  })





  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
