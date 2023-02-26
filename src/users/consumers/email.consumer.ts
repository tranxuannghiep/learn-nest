import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('register')
  async registerEmail(job: Job<unknown>) {
    await this.mailerService.sendMail({
      to: job.data['to'],
      subject: 'Welcome to my website',
      template: './welcome',
      context: {
        name: job.data['name'],
      },
    });
  }
}
