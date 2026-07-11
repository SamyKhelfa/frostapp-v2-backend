import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';
  private readonly apiKey = process.env.BREVO_API_KEY;
  private readonly senderEmail = process.env.BREVO_SENDER_EMAIL;
  private readonly senderName = process.env.BREVO_SENDER_NAME ?? 'Frost';

  onModuleInit() {
     this.logger.log('─── Email Service Config ───');
    this.logger.log(
      `BREVO_API_KEY : ${this.apiKey ? `✅ ${this.apiKey.slice(0, 12)}…` : '❌ MANQUANTE'}`,
    );
    this.logger.log(
      `BREVO_SENDER_EMAIL : ${this.senderEmail ? `✅ ${this.senderEmail}` : '❌ MANQUANT'}`,
    );
    this.logger.log(`BREVO_SENDER_NAME  : ${this.senderName}`);
    this.logger.log('────────────────────────────');
  }


  async sendEmail(
    to: string,
    templateId: number,
    params: Record<string, any> = {},
  ): Promise<void> {
    this.logger.log('═══ sendEmail() appelé ═══');
    this.logger.log(`  → to: ${to}`);
    this.logger.log(`  → templateId: ${templateId}`);
    this.logger.log(`  → params: ${JSON.stringify(params)}`);

    // Guards
    if (!this.apiKey) {
      this.logger.error('❌ BREVO_API_KEY manquante — abandon de l\'envoi');
      return;
    }

    if (!this.senderEmail) {
      this.logger.error('❌ BREVO_SENDER_EMAIL manquant — abandon de l\'envoi');
      return;
    }

    const payload = {
      sender: {
        name: this.senderName,
        email: this.senderEmail,
      },
      to: [{ email: to }],
      templateId,
      params,
    };

    this.logger.log(`  → payload envoyé à Brevo:`);
    this.logger.log(`     ${JSON.stringify(payload)}`);
    this.logger.log(`  → URL: ${this.apiUrl}`);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      this.logger.log(`  → Statut Brevo: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      this.logger.log(`  → Réponse Brevo: ${responseText}`);

      if (!response.ok) {
        this.logger.error(
          `❌ Brevo a refusé l'envoi (${response.status}) — voir réponse ci-dessus`,
        );
        throw new Error(`Brevo returned ${response.status}: ${responseText}`);
      }

      this.logger.log(`✅ Email envoyé à ${to} (template ${templateId})`);
    } catch (error) {
      this.logger.error(
        `🔴 Erreur envoi email vers ${to}: ${error.message}`,
      );

      throw new HttpException(
        `Failed to send email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
