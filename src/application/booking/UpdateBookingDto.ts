import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status; 
}
