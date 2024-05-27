export class UserUpdateContainer {
  constructor(
    public username:string,
    public password:string,

    public updatedUsername:string,
    public updatedEmail:string,
    public updatedPassword:string,
  ){}
}