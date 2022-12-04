const httpStatus = require("http-status");
const SectionService = require("../services/SectionService");

class Section {
  index(req, res) {
    if (!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({ error: "Proje Id bilgisi eksik" });
    SectionService.list({ projectId: req.params.projectId })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
  }

  create(req, res) {
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  update(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik." });
    }
    SectionService.update(req.params.id, req.body)
      .then((updatedProject) => res.status(httpStatus.OK).send(updatedProject))
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
  }

  deleteSection(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik" });
    }
    SectionService.delete(req.params?.id)
      .then((deletedSection) => {
        if (!deletedSection) {
          return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunmamaktadır." });
        }
        res.status(httpStatus.OK).send({ message: "Sections silinmiştir." });
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Silme işlemi sırasında bir problem olustu" }));
  }
}

module.exports = new Section();
