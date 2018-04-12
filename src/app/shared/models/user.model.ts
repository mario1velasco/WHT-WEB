export class User {
  id: string;
  email: string;
  password: string;
  username: string;
  social?: string;
  name?: string;
  familyname?: string;
  telephone?: string;
  role?: string;
  friends?: [string];
  about?: string;
  language?: string;
  photo?: string;
  expireSuperUser?: string;
}
