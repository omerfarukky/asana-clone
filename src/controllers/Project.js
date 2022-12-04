const httpStatus = require("http-status");
const ApiError = require("../error/apiError");
const ProjectService = require("../services/ProjectService");

class Project {
  index(req, res) {
    ProjectService.list()
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
  }

  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  update(req, res, next) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik." });
    }
    ProjectService.update(req.params.id, req.body)
      .then((updatedProject) => {
        if (!updatedProject) return next(new ApiError("Boyle bir kayıt bulunamadı", 404));
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((error) => next(new ApiError(error?.message)));
  }

  deleteProject(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik" });
    }
    ProjectService.delete(req.params?.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunmamaktadır." });
        }
        res.status(httpStatus.OK).send({ message: "Proje silinmiştir." });
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Silme işlemi sırasında bir problem olustu" }));
  }
}

module.exports = new Project();
