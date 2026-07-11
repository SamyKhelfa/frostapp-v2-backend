import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDTO, LoginDTO } from './dto';
import { IRegisterResponse, ILoginResponse } from './responses';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthServiceContract } from './contracts';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto'

const RESET_PASSWORD_TEMPLATE_ID = 1;

@Injectable()
export class AuthService implements AuthServiceContract {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
    @Inject(JwtService)
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private getToken(user: User): string {
    return this.jwtService.sign({
      userId: user.id,
    });
  }

  async login(dto: LoginDTO): Promise<ILoginResponse> {
    const { email, password } = dto;

    if (!email || !password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException(
        'Email or password are incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      throw new HttpException(
        'Email or password are incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const authToken = this.getToken(user);

    user.password = '';

    return {
      user,
      authToken,
    };
  }

  async register(dto: RegisterDTO): Promise<IRegisterResponse> {
    const { password, name, email } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    const authToken = this.getToken(user);

    user.password = '';

    return {
      user,
      authToken,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`🔑 forgotPassword() appelé pour: ${email}`);

    this.logger.log(`  → recherche du user en DB…`);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      this.logger.warn(`  ⚠️ Aucun compte trouvé pour ${email}`);
      this.logger.log(`  → on renvoie quand même le message générique (sécu)`);
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return {
        message:
          'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
      };
    }

    this.logger.log(`  ✅ User trouvé (id: ${user.id}, name: "${user.name}")`);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
    .digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await this.prisma.passwordResetToken.deleteMany({
      where: {userId: user.id},
    })

    await this.prisma.passwordResetToken.create({
      data: {tokenHash, userId: user.id, expiresAt},
    })

    const resetUrl = `frostapp://reset-password?token=${resetToken}`;
    this.logger.log(`  → resetUrl généré (token en clair envoyé par mail)`);



    try {
      await this.emailService.sendEmail(email, RESET_PASSWORD_TEMPLATE_ID, {
        name: user.name,
        resetUrl,
      });
      this.logger.log(`  ✅ Envoi mail OK pour ${email}`);
    } catch (error) {

      this.logger.error(
        `  🔴 Échec envoi mail pour ${email}: ${error.message}`,
      );
      this.logger.error(
        `  → mais on renvoie quand même le message générique (sécu)`,
      );
    }

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    })

    if (!record) {
      throw new HttpException(
        'Lien invalide ou expiré',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (record.usedAt) {
      throw new HttpException('Lien déjà utilisé', HttpStatus.BAD_REQUEST)
    }

    if (record.expiresAt < new Date()) {
      throw new HttpException('Lien expiré', HttpStatus.BAD_REQUEST)
    }

    const hashPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: hashPassword },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    })

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
