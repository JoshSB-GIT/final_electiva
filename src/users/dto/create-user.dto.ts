import { IsNotEmpty, Length } from "class-validator";


export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 50)
  username: string;

  @IsNotEmpty()
  @Length(4, 50)
  password: string;
}
