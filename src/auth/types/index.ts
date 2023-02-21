import User from '../models/user.model';

export interface JWTPayload {
  user: User;
}

export interface RequestWithUser extends Request {
  user: User;
}
