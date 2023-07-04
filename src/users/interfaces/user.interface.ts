export default interface IUser {
  id: string;
  email: string;
  username: string;
  tag: string;
  avatar: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}