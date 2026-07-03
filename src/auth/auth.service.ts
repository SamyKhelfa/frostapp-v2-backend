import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDTO, LoginDTO } from './dto';
import { IRegisterResponse, ILoginResponse } from './responses';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthServiceContract } from './contracts';
import { EmailService } from '../email/email.service';

// ID du template Brevo pour le mail de réinitialisation
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

  /**
   * Demande de réinitialisation de mot de passe.
   *
   * - Renvoie TOUJOURS le même message générique (anti-enumeration).
   * - Si le compte existe, envoie un email via le template Brevo #1.
   * - Si non, ne fait rien mais log en interne.
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`🔑 forgotPassword() appelé pour: ${email}`);

    // 1. Cherche l'utilisateur en DB
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

    // 2. Génère le token de reset (placeholder pour l'instant)
    const resetToken = 'todo-generer-un-vrai-token';
    const resetUrl = `frostapp://reset-password?token=${resetToken}`;
    this.logger.log(`  → resetUrl généré: ${resetUrl}`);

    // 3. Envoie le mail via Brevo
    this.logger.log(
      `  → appel EmailService.sendEmail(email=${email}, templateId=${RESET_PASSWORD_TEMPLATE_ID})`,
    );

    try {
      await this.emailService.sendEmail(email, RESET_PASSWORD_TEMPLATE_ID, {
        name: user.name,
        resetUrl,
      });
      this.logger.log(`  ✅ Envoi mail OK pour ${email}`);
    } catch (error) {
      // On log mais on ne remonte pas l'erreur au client
      // (sinon on révélerait que l'email existe)
      this.logger.error(
        `  🔴 Échec envoi mail pour ${email}: ${error.message}`,
      );
      this.logger.error(
        `  → mais on renvoie quand même le message générique (sécu)`,
      );
    }

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Message générique dans tous les cas — anti enumeration
    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    };
  }
}
