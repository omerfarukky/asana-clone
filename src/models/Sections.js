const mongoose = require("mongoose");
const logger = require("../scripts/logger/Sections");

const SectionSchema = mongoose.Schema(
  {
    name: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    project_id: {
      type: mongoose.Types.ObjectId,
      ref: "project",
    },
    order: Number,
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
SectionSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

const Section = mongoose.model("Section", SectionSchema);

module.exports = Section;
