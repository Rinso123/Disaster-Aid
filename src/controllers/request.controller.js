import Request from '../models/request.model.js';

export const createRequest = async (req, res) => {
  const { helpType, description, location } = req.body;
  const request = await Request.create({
    user: req.user.id,
    helpType, description,
    location: {
      type: 'Point', coordinates: location.split(",").map(Number).reverse()
    }
  });

  req.app.get('io').to('volunteer').emit('newRequest', {
    id: request._id,
    helpType: request.helpType,
    location: request.location,
    createdAt: request.createdAt
  });

  res.redirect("/");
};

export const getMatches = async (req, res) => {
  const { lng, lat } = req.query;
  const matches = await Request.aggregate([
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
    {
      $match: { status: "open" }
    }
  ]);
  res.json(matches);
};


export const accept = async (req, res) => {
  const { id } = req.params;

  await Request.updateOne({ _id: id }, {
    $set: {
      status: "fulfilled",
      provider: req.user.id
    }
  })

  res.status(200).json({ message: "Request accepted" });

}

export const getSelfRequest = async (userId) => {
  const data = await Request.find({ user: userId }).populate("provider").lean();
  return data;
}
