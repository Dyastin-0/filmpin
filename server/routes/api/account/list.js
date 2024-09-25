const express = require("express");
const router = express.Router();
const {
  handleGeUserLists,
  handleCreateList,
  handleGetList,
  handleAddItem,
  handlePatchList,
} = require("../../../controllers/account/list");

router.route("/:list_id").get(handleGetList);

router
  .route("/")
  .get(handleGeUserLists)
  .post(handleCreateList)
  .patch(handlePatchList);

router.route("/item").post(handleAddItem);

module.exports = router;
