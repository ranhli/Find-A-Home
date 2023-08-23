const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const mongoosePaginate = require("mongoose-paginate-v2");

const opts = { toJSON: { virtuals: true } };

const bnbSchema = new Schema(
  {
    title: String,
    price: Number,
    type: String,
    description: String,
    location: String,
    image: [
      {
        url: String,
        filename: String,
      },
    ],
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

bnbSchema.virtual("properties.popUpMsg").get(function () {
  return `<a href="/homes/${this._id}">${this.title}</a>`;
});

bnbSchema.post("findOneAndDelete", async function (bnb) {
  if (bnb) {
    await Review.deleteMany({
      _id: {
        $in: bnb.reviews,
      },
    });
  }
});

bnbSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Bnb", bnbSchema);
