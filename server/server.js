const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const {Dog} = require("./models/dog.js");
const _ = require("lodash");
const methodOverride = require("method-override")

const app = express();
const port = process.env.PORT || 3000;

//hbs set-up (from where server js is)
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../app/views"));
hbs.registerPartials(path.join(__dirname, "../app/views/partials"));

mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || 'mongodb://localhost:27017/Doglist';
//returns a promise
mongoose.connect(database)
.then(() => {
  console.log("Successful connection to database");
})
.catch(() => {
  console.log("Unable to to connect to database");
})

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.redirect("/dogs");
})

app.get("/dogs", (req, res) => {
  Dog.find()
     .then(dogs => {
       res.render("./dogs/index.hbs", { dogs });
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.get("/dogs/new", (req, res) => {
  //from views
  res.render("./dogs/new.hbs");
})

app.post("/dogs", (req, res) => {
  if(!req.body.name || !req.body.age) {
    //can put an object here and then pull of property and
    //handle the error
    res.status(400).send();
  }
  const dog = new Dog({
    name: req.body.name,
    age: req.body.age
  })
  dog.save()
  .then(dog => {
    // res.send(dog);
    res.redirect("/dogs");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})

app.get("/dogs/:id", (req, res) => {
  const id = req.params.id;
  Dog.findById(id)
     .then(dog => {
       res.render("./dogs/show.hbs", { dog });
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.delete("/dogs/:id", (req, res) => {
  console.log("hit delete route");
  const id = req.params.id;
  Dog.findByIdAndRemove(id)
     .then(dog => {
       console.log("Successful delete");
       res.redirect("/dogs");
     })
     .catch(e => {
       res.status(500).send(e);
     })
})

app.get("/dogs/:id/edit", (req, res) => {
  const id = req.params.id;
  Dog.findById(id)
     .then(dog => {
       res.render("./dogs/edit.hbs", {
         dog: dog
       });
     })
     .catch(e => {
       res.status(500).send(e)
     })
})

app.patch("/dogs/:id/edit", (req, res) => {
  console.log("hit update route");
  const id = req.params.id;
  Dog.findByIdAndUpdate(id, req.body, {new: true})
     .then(dog => {
       res.redirect("/dogs");
     })
     .catch(e => {
       res.status(500).send(e);
     })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
