const BaseServices = require("./BaseServices");
const BaseModel = require("../models/Projects");
const User = require("../models/Users");

class ProjectService extends BaseServices {
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
}

module.exports = new ProjectService();
