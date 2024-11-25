import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { BookingModule } from './application/booking/booking.module';
import { ServiceModule } from './application/service/service.module';
import { UserModule } from './application/user/user.module';


@Module({
  imports: [AuthModule, BookingModule, ServiceModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
