import { Authority } from "./authority.model.";

export class User {
  id?: number
  username?: string;
  firstname?: string;
  password?: string;
  rol?: Authority;
  authority?: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.firstname = user.firstname;
    this.password = user.password;
    this.rol = user.rol;
    this.authority = user.authority;
  }

}
