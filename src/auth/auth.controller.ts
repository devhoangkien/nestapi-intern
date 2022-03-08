import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import RequestWithUser from './request-with-user.interface';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ description: 'user login successfully' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, true);
  }

  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ description: 'admin login successfully' })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  public async adminLogin(@Body() loginDTO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDTO, false);
  }

  @ApiOperation({ summary: 'User register' })
  @ApiCreatedResponse({
    description: 'Please check your email and activate your account',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }

  @ApiOperation({ summary: 'User confirm email' })
  @ApiOkResponse({ description: 'User confirm successfully' })
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ description: 'Please check mail!' })
  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ description: 'Password Changed!' })
  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiOperation({ summary: 'Profile my account' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async profile(@Request() request) {
    return this.service.me(request.user);
  }

  @ApiOperation({ summary: 'Update Profile' })
  @ApiBearerAuth()
  @Patch('profile/update')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request) {
    return this.service.softDelete(request.user);
  }

  @ApiBearerAuth()
  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.service.getCookiesForLogOut());
  }
}
