const mongoose = require("mongoose");
const logger = require("../scripts/logger/Tasks");

const TaskSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    assigned_to: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    due_date: Date,
    statuses: [String],
    section_id: {
      type: mongoose.Types.ObjectId,
      ref: "section",
    },
    project_id: {
      type: mongoose.Types.ObjectId,
      ref: "project",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    order: Number,
    isCompleted: Boolean,
    comments: [
      {
        comment: String,
        commented_at: Date,
        user_id: {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    media: [String],
    sub_tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "task",
      },
    ],
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

TaskSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
