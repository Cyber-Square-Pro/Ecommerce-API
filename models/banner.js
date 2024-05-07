const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
 
  images: {
    type: String, 
    required: true,
  },
});

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
