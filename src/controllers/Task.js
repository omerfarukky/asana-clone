const httpStatus = require("http-status");

const TaskService = require("../services/TaskService");

class Task {
  index(req, res) {
    if (!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({ error: "Proje Id bilgisi eksik" });
    TaskService.list({ project_id: req.params.projectId })
      .then((response) => res.status(httpStatus.OK).send(response))
      .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
  }

  create(req, res) {
    req.body.user_id = req.user;
    TaskService.create(req.body)
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
    TaskService.update({ _id: req.params?.id }, req.body)
      .then((updatedDoc) => res.status(httpStatus.OK).send(updatedDoc))
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
  }

  deleteTask(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik" });
    }
    TaskService.delete(req.params?.id)
      .then((deletedSection) => {
        if (!deletedSection) {
          return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunmamaktadır." });
        }
        res.status(httpStatus.OK).send({ message: "Tasks silinmistir." });
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Silme işlemi sırasında bir problem olustu" }));
  }

  makeComment(req, res) {
    TaskService.findOne({ _id: req.params?.id })
      .then((mainTask) => {
        if (!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunamadı" });
        const comment = {
          ...req.body,
          user_id: req.user,
          commented_at: new Date(),
        };
        mainTask.comments.push(comment);
        mainTask
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
  }

  deleteComment(req, res) {
    TaskService.findOne({ _id: req.params?.id })
      .then((mainTask) => {
        if (!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunamadı" });
        mainTask.comments = mainTask.comments.filter((c) => c._id?.toString() !== req.params.commentId);
        mainTask
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
  }

  addSubTask(req, res) {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi hatalı" });
    //! MainTask Çekilir
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kayıt bulunamadı" });
        // Subtask Create edilir (task)
        TaskService.create({ ...req.body, user_id: req.user })
          .then((subTask) => {
            // Subtaskin Referansı MainTAsk üzerinde gösterilir ve update edilir
            mainTask.sub_tasks.push(subTask);
            mainTask
              .save()
              .then((updatedDoc) => {
                // Kullanıcıya yeni döküman gönderilir
                return res.status(httpStatus.OK).send(updatedDoc);
              })
              .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
          })
          .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
          });
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleme sırasında bir problem olustu." }));
  }

  fetchTask(req, res) {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi hatalı" });
    TaskService.findOne({ _id: req.params.id }, true)
      .then((task) => {
        if (!task) return res.status(httpStatus.NOT_FOUND).send({ message: "Boyle bir kayıt bulunamadı" });
        res.status(httpStatus.OK).send(task);
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error));
  }
}

module.exports = new Task();
