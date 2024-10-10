const express = require("express");
const router = express.Router();
const {
  handleGeUserLists,
  handleCreateList,
  handleGetList,
  handleAddItem,
  handlePatchList,
  handleSearchList,
} = require("../../../controllers/account/list");

router.route("/:list_id").get(handleGetList);

router
  .route("/")
  .get(handleGeUserLists)
  .post(handleCreateList)
  .patch(handlePatchList);

router.route("/item").post(handleAddItem);

router.route("/search/:query").get(handleSearchList);

module.exports = router;
