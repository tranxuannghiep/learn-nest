import { Module } from '@nestjs/common';
import Stripe from 'stripe';

@Module({
  providers: [
    {
      provide: 'STRIPE',
      useValue: new Stripe(
        'sk_test_51LreDHCrE73KXWJrqDsYgj1YiI7p5HpOdfldbDtwaiIZ5b6FfA0NnTdB2VdAYIbHLwkrFG6Z9Lt9OhaCWJHIkyLa00mkcO4R7S',
        {
          apiVersion: '2022-11-15',
        },
      ),
    },
  ],
  exports: ['STRIPE'],
})
export class StripeModule {}
