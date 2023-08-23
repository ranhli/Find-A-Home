const Bnb = require("../models/bnb");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const { page, type } = req.query;
  if (!page) {
    const bnbs = await Bnb.paginate(
      { type: type ? type : ["House", "Apartment", "Guesthouse", "Hotel"] },
      { limit: 20 }
    );
    res.render("bnbs/index", { bnbs });
  } else {
    const bnbs = await Bnb.paginate(
      { type: type ? type : ["House", "Apartment", "Guesthouse", "Hotel"] },
      { page }
    );
    res.status(200).json(bnbs);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("bnbs/new");
};

module.exports.createBnb = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.bnb.location, limit: 1 })
    .send();
  const bnb = new Bnb(req.body.bnb);
  bnb.geometry = geoData.body.features[0].geometry;
  bnb.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bnb.author = req.user._id;
  await bnb.save();
  req.flash("success", "Successfully created a new property");
  res.redirect(`/homes/${bnb._id}`);
};

module.exports.showBnb = async (req, res) => {
  const bnb = await Bnb.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!bnb) {
    req.flash("error", "Cannot find that property");
    res.redirect("/homes");
  } else {
    res.render("bnbs/show", { bnb });
  }
};

module.exports.renderEditForm = async (req, res) => {
  const bnb = await Bnb.findById(req.params.id);
  if (!bnb) {
    req.flash("error", "Cannot find that property");
    res.redirect("/homes");
  } else {
    res.render("bnbs/edit", { bnb });
  }
};

module.exports.editBnb = async (req, res) => {
  const { id } = req.params;
  const bnb = await Bnb.findByIdAndUpdate(id, { ...req.body.bnb });
  const newImg = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bnb.image.push(...newImg);
  console.log(bnb);
  await bnb.save();
  req.flash("success", "Successfully updated a property");
  res.redirect(`/homes/${bnb._id}`);
};

module.exports.deleteBnb = async (req, res) => {
  const { id } = req.params;
  await Bnb.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a property");
  res.redirect("/homes");
};
