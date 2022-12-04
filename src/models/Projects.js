const mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

// timestamps olusturma ve update tarihleri
// versionKey veresion keylerini gösterme
/* 
ProjectSchema.pre("save",(doc,next)=>{
  console.log("öncesinde calisti",doc)
  next();
})
*/
ProjectSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
