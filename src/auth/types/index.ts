import User from '../models/user.model';

export interface JWTPayload {
  user: User;
}
