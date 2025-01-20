import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};
//HTTPInterceptor ашиглан HTTP хүсэлтүүдэд автоматжуулсан токен нэмэх үйлдлийг гүйцэтгэж байна.

//inject: Angular-ийн dependency injection-ийг ашиглан AuthService-ийг интерцептор дотор ашиглах боломжийг олгодог.
//AuthService: Нэвтрэлтийн үйлчилгээ (токен авах болон бусад холбогдох функцуудыг агуулсан).

//inject(AuthService): AuthService-ийг интерцепторт оруулж, хэрэглэгчийн токенийг авах боломжийг олгоно.
//authService.getToken(): AuthService-ээс хэрэглэгчийн authentication token (нэвтрэлтийн токен)-ийг авах.

//if (token): Хэрэв токен байгаа бол дараах үйлдлүүдийг хийнэ.
// req.clone(...): Оригинал HTTP хүсэлтийг clone хийж, Authorization хуудасны толгой дээр токен нэмж өгч байна.
// req.headers.set('Authorization', Bearer ${token}): Authorization толгой дээр Bearer схемтэй токен нэмэх.
// return next(cloned): Шинээр үүсгэсэн хүсэлтийг дараагийн интерцептор эсвэл сервер рүү дамжуулна.