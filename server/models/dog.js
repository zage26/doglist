const mongoose = require("mongoose");

const dogSchema = mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    minLength: 1,
    trim: true
  }

});

const Dog = mongoose.model("Dog", dogSchema);

module.exports = { Dog };
