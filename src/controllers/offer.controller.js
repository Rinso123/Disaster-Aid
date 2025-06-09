import Offer from '../models/offer.model.js';

export const createOffer = async (req, res) => {
  const { helpType, description, location } = req.body;
  console.log(location);
  const offer = await Offer.create({
    provider: req.user.id,
    helpType, description,
    location: { type: 'Point', coordinates: location.split(",").map(Number).reverse() }
  });

  req.app.get('io').to('victim').emit('newOffer', {
    id: offer._id,
    helpType: offer.helpType,
    location: offer.location,
    createdAt: offer.createdAt
  });

  res.redirect("/");
};

export const getMatches = async (req, res) => {
  const { lng, lat } = req.query;
  console.log(lng, lat);
  const matches = await Offer.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [+lng, +lat] },
        distanceField: 'dist',
        maxDistance: 5000,
        spherical: true,
        query: {
          status: 'open'
        }
      }
    },
  ]);
  res.json(matches);
};

export const accept = async (req, res) => {
  const { id } = req.params;

  await Offer.updateOne({ _id: id }, {
    $set: {
      status: "accepted",
      receiver: req.user.id
    }
  })

  res.status(200).json({ message: "Request accepted" });
};


export const getSelfOffers = async (userId) => {
  const data = await Offer.find({ provider: userId }).populate("receiver").lean();
  return data;
}
