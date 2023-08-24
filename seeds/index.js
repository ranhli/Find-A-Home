const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, types } = require("./seedHelpers");
const Bnb = require("../models/bnb");
const srcs = require("./images");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MONGODB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION ERROR");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Bnb.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const random190 = Math.floor(Math.random() * 190);
    const random190_2 = Math.floor(Math.random() * 190);
    const randPrice = Math.floor(Math.random() * 100) + 100;
    const randLocation = cities[random1000];
    const b = new Bnb({
      location: `${randLocation.city}, ${randLocation.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      type: `${sample(types)}`,
      price: randPrice,
      geometry: {
        type: "Point",
        coordinates: [randLocation.longitude, randLocation.latitude],
      },
      image: [
        { url: `${srcs[random190].src}`, filename: `${random190}` },
        { url: `${srcs[random190_2].src}`, filename: `${random190_2}` },
      ],
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non exercitationem culpa esse atque labore soluta possimus sed sint est illum incidunt tenetur, enim earum quidem eligendi voluptatem alias temporibus consectetur!",
      author: "64e6ca8e276b76217690602c",
    });
    await b.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("MONGODB CONNECTION CLOSE");
});
