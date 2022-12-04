const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const errorHandler = require("./middlewares/errorHandler");
const { ProjectRoute, UserRoute, SectionRoute, TaskRoute } = require("./routes");

config();
loaders();
events();

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log("Run Server");

  app.use("/projects", ProjectRoute);
  app.use("/users", UserRoute);
  app.use("/sections", SectionRoute);
  app.use("/tasks", TaskRoute);

  app.use((req, res, next) => {
    const error = new Error("Aradığınız sayfa bulunamadı...");
    error.status = 404;
    next(error);
  });

  // ! Error Handler
  app.use(errorHandler);
});
