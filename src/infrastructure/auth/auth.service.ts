import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(username: string, password: string) {
    const expectedUser = this.config.get<string>('AUTH_USERNAME') ?? '';
    const expectedPass = this.config.get<string>('AUTH_PASSWORD') ?? '';

    if (username !== expectedUser || password !== expectedPass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: username, username };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
