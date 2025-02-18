const express = require("express");
const app = express();
const router = express.Router();
const Listing = require("../models/listing");
const methodOverride = require("method-override");
const { isLoggedIn } = require("../middleware");

//index route
router.get("/", async (req, res) => {
  try {
    const allList = await Listing.find({});
    res.render("listings/index.ejs", { allList });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).send("Server Error");
  }
});
// router.get("/", async (req, res) => {
//   const allList = await Listing.find({});
//   res.render("listings/index.ejs", { allList });
// });

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("Error", "No Listing Exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
  console.log(listing);
});

//create route
router.post("/", isLoggedIn, async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
});

//edit route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Edited!");
  res.render("listings/edit.ejs", { listing });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Something went wrong while deleting!");
    res.redirect("/listings");
  }
});

module.exports = router;
