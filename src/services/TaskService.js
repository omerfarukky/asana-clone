const BaseServices = require("./BaseServices");
const BaseModel = require("../models/Tasks");
const User = require("../models/Users");

class TaskService extends BaseServices {
  constructor() {
    super(BaseModel);
  }

  list(where) {
    return BaseModel.find(where || {}).populate(
      "user_id", // Path
      "full_name email profile_image", // Select
      User
    );
  }

  findOne(where, expand) {
    if (!expand) return BaseModel.findOne(where);
    return BaseModel.findOne(where)
      .populate(
        "user_id", // Path
        "full_name email profile_image", // Select
        User
      )
      .populate({
        path: "comments", // Path
        populate: {
          path: "user_id", // Path
          select: "full_name email profile_image", // Select
          model: User,
        },
      })
      .populate(
        "sub_tasks", // Path
        "title description isCompulated assigned_to due_date order statuses sub_tasks", // Select
        BaseModel
      );
  }
}

module.exports = new TaskService();
