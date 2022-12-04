let BaseModel = null;
class BaseServices {
  constructor(model) {
    this.BaseModel = model;
  }
  list(where) {
    return this.BaseModel?.find(where || {});
  }
  create(data) {
    const baseModel = new this.BaseModel(data);
    return baseModel.save();
  }
  findOne(where) {
    return this.BaseModel.findOne({ where });
  }
  update(id, data) {
    return this.BaseModel.findByIdAndUpdate(id, data, { new: true });
  }
  updateWhere(where, data) {
    return this.BaseModel.findOneAndUpdate(where, data, { new: true });
  }
  delete(id) {
    return this.BaseModel.findByIdAndDelete(id);
  }
}

module.exports = BaseServices;
