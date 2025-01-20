import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user && request.user.role === 'admin';
  }
}
//NestJS (Бекэнд)
// Бекэнд дээрх маршрут/API хамгаалалт
// request.user.role-г шууд шалгах
// Чиглүүлэлт хийхгүй, зөвхөн false буцаана
// Шууд HTTP хүсэлтийг ашигладаг
// Бекэнд-ийн гүйцэтгэлийн контекст (ExecutionContext)