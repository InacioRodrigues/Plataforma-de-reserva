import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateBookingDto {
  @IsNumber()
  serviceId: number;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
