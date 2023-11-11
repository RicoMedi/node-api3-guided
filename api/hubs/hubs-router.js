const express = require("express");
const { checkHubId, checkNewHub } = require("./hubs-middleware.js");
const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  Hubs.find(req.query)
    .then((hubs) => {
      ``;
      res.status(200).json(hubs);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", checkHubId, (req, res, next) => {
  // eslint-disable-line
  res.json(req.hub);
});

router.post("/", checkNewHub, (req, res, next) => {
  Hubs.add(req.body)
    .then((hub) => {
      res.status(201).json(hub);
    })
    .catch(next);
});

router.delete("/:id", checkHubId, (req, res, next) => {
  Hubs.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "The hub has been nuked" });
    })
    .catch((error) => {
      // log error to server
      next(error);
    });
});

router.put("/:id", checkHubId,checkNewHub,(req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then((hub) => {
        res.status(200).json(hub);
    })
    .catch(next);
});

router.get("/:id/messages", checkHubId, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(next);
});

router.post("/:id/messages", checkHubId, (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };
  Messages.add(messageInfo)
    .then((message) => {
      res.status(210).json(message);
    })
    .catch(next);
});

router.use((error, req, res, next) => {// eslint-disable-line
  res.status(error.status || 500).json({
    message: error.message,
    customeMessage: "oooops didnt work inside the hubs router",
  });
});

module.exports = router;
