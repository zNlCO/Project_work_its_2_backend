import  mongoose, { Schema } from 'mongoose';
import { UserIdentity as iUserIdentity} from './user-identity.entity';

export const userIdentitySchema = new mongoose.Schema<iUserIdentity>({
  contoCorrente: {type: Schema.Types.ObjectId, ref: 'ContoCorrente'},
  provider: {type: String, default: 'local'},
  credentials: {type: {
    email: String,
    hashedPassword: String
  }}
});

//hook: ogni volta che viene fatto un find su un UserIdentity prende anche il corrispondente conto da solo
userIdentitySchema.pre('findOne', function(next) {
  this.populate('contoCorrente');
  next();
});


export const UserIdentity = mongoose.model<iUserIdentity>('UserIdentity', userIdentitySchema);
