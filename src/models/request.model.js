import mongoose from 'mongoose';
const requestSchema = new mongoose.Schema({
  user:        { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  helpType:    { type: String, enum: ['food','shelter','medicine'], required: true },
  description: { type: String },
  location:    {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  status:      { type: String, enum: ['open','fulfilled'], default: 'open' },
  createdAt:   { type: Date, default: Date.now }
});
requestSchema.index({ location: '2dsphere' });
export default mongoose.model('Request', requestSchema);
