import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}

//Esse guard é usado no LOGIN.

// Ele valida:

// username/email
// password

// antes de gerar o JWT.

// @UseGuards(LocalAuthGuard)
