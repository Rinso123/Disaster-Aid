import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['victim','volunteer','admin'], required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
});
userSchema.index({ location: '2dsphere' });
export default mongoose.model('User', userSchema);
