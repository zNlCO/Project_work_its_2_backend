import  mongoose, { Schema } from 'mongoose';
import { UserIdentity as iUserIdentity} from './user-identity.entity';

export const userIdentitySchema = new mongoose.Schema<iUserIdentity>({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  provider: {type: String, default: 'local'},
  credentials: {type: {
    email: String,
    hashedPassword: String
  }}
});

//hook: ogni volta che viene fatto un find su un UserIdentity prende anche il corrispondente conto da solo
userIdentitySchema.pre('findOne', function(next) {
  this.populate('user');
  next();
});


export const UserIdentity = mongoose.model<iUserIdentity>('UserIdentity', userIdentitySchema);
