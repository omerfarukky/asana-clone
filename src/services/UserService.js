const BaseServices = require("./BaseServices");
const BaseModel = require("../models/Users");

class UserService extends BaseServices {
  constructor() {
    super(BaseModel);
  }
}

module.exports = new UserService();
