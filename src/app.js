const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { body: { url, title, techs } } = request;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {
    params: {
      id,
    },
    body: {
      url,
      title,
      techs,
    }
  } = request;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  }

  const oldRepository = repositories.find(repository => repository.id === id);

  const repository = {
    ...oldRepository,
    title,
    url,
    techs,
  };

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { params: { id } } = request;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  }

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { params: { id } } = request;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  }

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
