const express = require("express");
const router = express.Router();
const {
  handleGeUserLists,
  handleCreateList,
  handleGetList,
  handleAddItem,
  handlePatchList,
  handleSearchList,
  handleDeleteList,
} = require("../../../controllers/api/account/list");

router.route("/search").get(handleSearchList);
router.route("/:list_id").get(handleGetList).delete(handleDeleteList);
router
  .route("/")
  .get(handleGeUserLists)
  .post(handleCreateList)
  .patch(handlePatchList);

router.route("/item").post(handleAddItem);

module.exports = router;
