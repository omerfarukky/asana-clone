const httpStatus = require("http-status");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const { passwordToHash, generateAccessToken, genereteRefreshToken } = require("../scripts/utils/helper");
const UserService = require("../services/UserService");
const ProjectService = require("../services/ProjectService");

class User {
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }

  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).send({ message: "Kullanıcı bulunamadı" });
        }
        user = {
          ...user.toObject(),
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: genereteRefreshToken(user),
          },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((error) => {
        res.status(INTERNAL_SERVER_ERROR).send(error);
      });
  }

  index(req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }

  projectList(req, res) {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Projeleri getirirken beklenmedik bir hata oluştu." });
      });
  }

  resetPassword(req, res) {
    const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    UserService.updateWhere({ email: req.body.email }, { password: passwordToHash(new_password) })
      .then((updateUser) => {
        if (!updateUser) return res.status(httpStatus.NOT_FOUND).send({ error: "Böyle bir kullanıcı bulunamdı." });
        eventEmitter.emit("send_email", {
          to: updateUser.email, // list of receivers
          subject: "Sifre Sıfırlama", // Subject line
          html: `Talebiniz üzerine sifre sıfırlama islemi gerceklesmistir.
          </br> Sisteme giris yaptıktan sonra sifrenizi değiştimeyi unutmayınız
          </br> Yeni sifreniz : <b>${new_password}</b>`, // html body
        });
        res.status(httpStatus.OK).send({
          message: "Sifre sıfırlama islemi icin eposta adresinize gerekli bilgileri gönderdik.",
        });
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Sifre resetleme sırasında bir problem oluştu" });
      });
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.update({ _id: req.user?._id }, req.body)
      .then((changePassword) => {
        res.status(httpStatus.OK).send(changePassword);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleştirme sırasında problem olustu" });
      });
  }

  update(req, res) {
    UserService.update({ _id: req.user?._id }, req.body)
      .then((updateUser) => {
        res.status(httpStatus.OK).send(updateUser);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Güncelleştirme sırasında problem olustu" });
      });
  }

  updateProfileImage(req, res) {
    // 1- Resim Kontrolü
    if (!req?.files?.profile_image) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Dosya Bulunmamaktadır" });
    }
    // 2- Upload İşlemi
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req?.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);

    req.files.profile_image.mv(folderPath, function (err) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
      UserService.update({ _id: req.user._id }, { profile_image: fileName })
        .then((updatedUser) => {
          res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((error) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Dosya Yükleme İşlemi başarısız" });
        });
    });
  }

  deleteUser(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: "ID bilgisi eksik" });
    }
    UserService.delete(req.params?.id)
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kullanıcı bulunmamaktadır." });
        }
        res.status(httpStatus.OK).send({ message: "User silinmiştir." });
      })
      .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Silme işlemi sırasında bir problem olustu" }));
  }
}

module.exports = new User();
