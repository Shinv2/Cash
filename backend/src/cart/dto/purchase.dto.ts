import { IsString, IsOptional } from 'class-validator';

export class PurchaseDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  shippingAddress?: string;
}
