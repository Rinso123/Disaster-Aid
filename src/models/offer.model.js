import mongoose from 'mongoose';
const offerSchema = new mongoose.Schema({
  provider:    { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  helpType:    { type: String, enum: ['food','shelter','medicine'], required: true },
  description: { type: String },
  location:    {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  status:      { type: String, enum: ['open','accepted'], default: 'open' },
  createdAt:   { type: Date, default: Date.now }
});
offerSchema.index({ location: '2dsphere' });
export default mongoose.model('Offer', offerSchema);
