const BaseServices = require("./BaseServices");

const BaseModel = require("../models/Sections");
const Project = require("../models/Projects");
const User = require("../models/Users");

class SectionService extends BaseServices {
  constructor() {
    super(BaseModel);
  }

  list(where) {
    return BaseModel.find(where || {}).populate(
      "user_id", // Path
      "full_name email profile_image", // Select
      User
    );
    /*
    .populate(
      "project_id", // Path
      "name", // Select 
      Project
    )
    */
  }
}

module.exports = new SectionService();
