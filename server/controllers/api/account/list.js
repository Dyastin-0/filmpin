const Lists = require("../../../models/list");
const Users = require("../../../models/user");
const listTypes = require("../../../models/listTypes");

/**
 * Creates a new list for a user.
 * @param {Object} req - The request object.
 * @param {string} req.id - The ID of the user.
 * @param {Object} req.body.list - The list object from the request body.
 * @param {string} req.body.list.name - The name of the list.
 * @param {string} [req.body.list.description] - The description of the list.
 * @param {Array} req.body.list.list - The items in the list.
 * @param {string} req.body.list.type - The type of the list.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the new list ID.
 * @returns {string} returns.list_id - The ID of the newly created list.
 */
const handleCreateList = async (req, res) => {
  const { id } = req;
  const { name, description, list, type } = req.body.list;

  if (!name) return res.status(400).json({ message: "Missing name." });
  if (!list || list.length < 1)
    return res.status(400).json({ message: "List is empty/null/undefined." });
  if (!type || listTypes[type] === undefined)
    return res.status(400).json({ message: "Missing/Invalid type." });

  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User not found." });

    const newList = await Lists.create({
      owner: id,
      name: name,
      list: list,
      type: listTypes[type],
      description: description,
    });

    const newUserLists = user.lists
      ? user.lists.concat(newList._id)
      : [newList._id];
    await Users.updateOne({ _id: id }, { $set: { lists: newUserLists } });

    res.json({ list_id: newList._id });
  } catch (error) {
    console.error("Failed to create list.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches the lists for a specific user.
 * @param {Object} req - The request object.
 * @param {string} req.query.user_id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the specified user's lists.
 * @returns {Array} returns.lists - An array of lists owned by the user.
 */
const handleGeUserLists = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ message: "Missing ID." });

  try {
    const response = await Lists.find({ owner: user_id });
    res.json(response);
  } catch (error) {
    console.error("Failed to fetch user lists.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches a specific list by its ID.
 * @param {Object} req - The request object.
 * @param {string} req.params.list_id - The ID of the list.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the specified list.
 * @returns {Object} returns.list - The list object.
 */
const handleGetList = async (req, res) => {
  const { list_id } = req.params;

  if (!list_id) return res.status(400).json({ message: "Missing list ID." });

  try {
    const response = await Lists.findOne({ _id: list_id });
    res.json(response);
  } catch (error) {
    console.error("Failed to fetch list.", error);
    res.sendStatus(500);
  }
};

/**
 * Adds an item to a specific list.
 * @param {Object} req - The request object.
 * @param {string} req.body.list_id - The ID of the list.
 * @param {Object} req.body.list_item - The item to add to the list.
 * @param {string} req.id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the updated list name.
 * @returns {string} returns.list_name - The name of the updated list.
 */
const handleAddItem = async (req, res) => {
  const { list_id, list_item } = req.body;
  const { id } = req;

  if (!list_id) return res.status(400).json({ message: "Missing list ID." });
  if (!list_item)
    return res.status(400).json({ message: "Missing list item." });

  try {
    const list = await Lists.findOne({ _id: list_id });
    if (!list) return res.status(400).json({ message: "List does not exist." });
    if (list.list.some((item) => item.id == list_item.id))
      return res.status(400).json({
        message: `${list_item.title} is already in your ${list.name}.`,
      });

    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "User does not exist." });
    if (user._id.toString() !== list.owner)
      return res.status(400).json({ message: "Invalid user." });

    const newList = list.list ? [...list.list, list_item] : [list_item];
    await Lists.updateOne({ _id: list_id }, { $set: { list: newList } });

    res.json({ list_name: list.name });
  } catch (error) {
    console.error("Failed to add item to list.", error);
    res.sendStatus(500);
  }
};

/**
 * Updates a specific list with a new list of items.
 * @param {Object} req - The request object.
 * @param {string} req.query.list_id - The ID of the list.
 * @param {Array} req.body.new_list - The new list of items.
 * @param {string} req.id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {string} returns.message - A success message indicating the list was updated.
 */
const handlePatchList = async (req, res) => {
  const { list_id } = req.query;
  const { new_list } = req.body;
  const { id } = req;

  if (!list_id) return res.status(400).json({ message: "Missing list ID." });
  if (!new_list) return res.status(400).json({ message: "Missing new list." });

  try {
    const list = await Lists.findOne({ _id: list_id });

    if (!list) return res.status(400).json({ message: "List does not exist." });

    if (list.owner !== id)
      return res
        .status(403)
        .json({ message: "You can't edit someone else's list." });

    await Lists.updateOne({ _id: list_id }, { $set: { list: new_list } });
    res.json({ message: "List updated." });
  } catch (error) {
    console.error("Failed to update list.", error);
    res.sendStatus(500);
  }
};

const handleSearchList = async (req, res) => {
  const { query, page, limit } = req.query;

  if (!query) return res.status(400).json({ message: "Missing query." });
  if (!page) return res.status(400).json({ message: "Missing page." });

  const paginationSize = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const lists = await Lists.find({
      name: { $regex: query, $options: "i" },
    })
      .skip(skip)
      .limit(paginationSize);

    const total = await Lists.countDocuments({
      name: { $regex: query, $options: "i" },
    });
    const total_pages = Math.ceil(total / paginationSize);

    res.json({
      lists,
      current_page: page,
      total_pages,
      total_lists: total,
    });
  } catch (error) {
    console.error("Failed to search for list.", error);
    res.sendStatus(500);
  }
};

const handleDeleteList = async (req, res) => {
  const { list_id } = req.params;
  const { id } = req;

  if (!list_id) return res.status(400).json({ message: "Missing list ID." });

  try {
    const list = await Lists.findOne({ _id: list_id });

    if (!list) return res.status(400).json({ message: "List does not exist." });

    if (list.owner !== id)
      return res
        .status(403)
        .json({ message: "You can't delete someone else's list." });

    await Lists.deleteOne({ _id: list_id });
    res.json({ message: "List deleted." });
  } catch (error) {
    console.error("Failed to delete list.", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleGeUserLists,
  handleCreateList,
  handleGetList,
  handleAddItem,
  handlePatchList,
  handleSearchList,
  handleDeleteList,
};
