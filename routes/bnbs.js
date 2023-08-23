const express = require("express");
const router = express.Router({});
const catchAsync = require("../utils/catchAsync");
const bnb = require("../controllers/bnb");
const { validateBnb, isLoggedIn, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(bnb.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateBnb,
    catchAsync(bnb.createBnb)
  );

router.get("/new", isLoggedIn, bnb.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(bnb.showBnb))
  .put(isLoggedIn, upload.array("image"), validateBnb, catchAsync(bnb.editBnb))
  .delete(isLoggedIn, isAuthor, catchAsync(bnb.deleteBnb));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(bnb.renderEditForm));

module.exports = router;
