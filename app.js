//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to the todolistDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true });

// Creating a schema
const itemsSchema = {
  name: String
};
// Creating a model
const Item = mongoose.model("Item", itemsSchema);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// Default items
const cleanRoom = new Item({ name: "Clean Room" });
const buyFood = new Item({ name: "Buy Food" });
const defaultItems = [cleanRoom, buyFood];

// Item.insertMany(defaultItems, function(err) {
//   if(err) {
//     console.log(err)
//   } else {
//     console.log("Succesfully inserted default values!");
//   }
// })
app.get("/", function(req, res) {

// Populatin table with data from DB
  Item.find({}, function(err, foundItems){
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  })



});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
