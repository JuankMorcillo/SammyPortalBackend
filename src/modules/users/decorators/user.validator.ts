import { Injectable, PipeTransform } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint } from "class-validator";
import { UsersService } from "../users.service";

@ValidatorConstraint({ name: 'userExists', async: true })
@Injectable()
export class userExistsConstraint {
    constructor(protected readonly userService: UsersService) { }

    async validate(email: string): Promise<boolean> {
        const user = await this.userService.isRegistered(email);
        return user.id == 0;
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        return `User with email: ${validationArguments.value} is already registered.`;
    }

}

@Injectable()
export class UserExistsPipe implements PipeTransform {
    constructor(protected readonly userService: UsersService) { }

    async transform(body: any): Promise<number> {

        const id = body.authorUserId;

        const user = await this.userService.findOne(id);
        if (user.id === 0) {
            throw new Error(`User with id ${id} does not exist`);
        }
        return body;
    }
}