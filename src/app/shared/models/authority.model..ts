export class Authority {

  id?: number
  name?: string;
  authority?: string;

  constructor(authorityuser: Authority) {
    this.id = authorityuser.id;
    this.authority = authorityuser.authority;
    this.name = authorityuser.name;
  }

}
