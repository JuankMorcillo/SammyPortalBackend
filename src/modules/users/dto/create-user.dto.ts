import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Validate } from "class-validator";
import { userExistsConstraint } from "../decorators/user.validator";

export class CreateUserDto {

    @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    first_name: string;

    @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    last_name?: string;

    @ApiProperty({ example: 'email@email.com', description: 'Email address of the user' })
    @IsEmail()
    @Validate(userExistsConstraint)
    email: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL of the user avatar' })
    @IsString()
    avatar?: string;

}
