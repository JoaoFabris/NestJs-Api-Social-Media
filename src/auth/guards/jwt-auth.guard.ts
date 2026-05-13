import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

//Esse guard usa a strategy chamada "jwt". @UseGuards(JwtAuthGuard)
