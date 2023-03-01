import { Controller, Post, Body, Res, Headers } from '@nestjs/common';
import { Stripe } from 'stripe';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripe: Stripe) {}

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      // thay API key của bạn ở đây
      process.env.STRIPE_WEBHOOK_SECRET_KEY || '',
    );

    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      // lấy thông tin order từ session
      const order: any = await this.getOrderFromSession(session.id);
      // tạo order sau khi thanh toán thành công
      await this.createOrder(order);
    }

    res.sendStatus(200);
  }

  async getOrderFromSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const order = session.metadata.order;
    return order;
  }

  async createOrder(order: any) {
    // tạo order ở đây
  }
}
