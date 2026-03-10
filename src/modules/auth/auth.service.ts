import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) { }

    async login(loginDto: LoginDto) {

        const reqresResponse = await fetch(`${this.configService.get('reqres.reqresUrl')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${this.configService.get('reqres.reqresKey')}`,
            },
            body: JSON.stringify({
                email: loginDto.email,
                password: loginDto.password,
            }),
        });

        if (!reqresResponse.ok) {
            const error = await reqresResponse.json();
            throw new UnauthorizedException(error.error || 'Invalid credentials');
        }

        const payload = { email: loginDto.email };

        const isRegistered = await this.usersService.isRegistered(loginDto.email);

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
        });

        return { accessToken, ...isRegistered };
    }
}
