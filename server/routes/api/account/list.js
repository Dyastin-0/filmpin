const express = require("express");
const router = express.Router();
const {
  handleGeUserLists,
  handleCreateList,
  handleGetList,
  handleAddItem,
} = require("../../../controllers/account/list");

router.route("/:list_id").get(handleGetList);

router.route("/").get(handleGeUserLists).post(handleCreateList);

router.route("/item").post(handleAddItem);

module.exports = router;
