import { Injectable } from '@angular/core';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    localStorage.setItem('redirectUrl', state.url);
    return this.router.createUrlTree(['/login']);
  }
}

//AuthService: Энэ нь таны хэрэглэгчийн нэвтрэх статустай холбоотой үйлчилгээ. 
//хэрэглэгчийн нэвтэрсэн эсэхийг шалгах функц isLoggedIn()-ийг энэ үйлчилгээний дотор ашигладаг.

//Router: Энэ нь Angular маршрутын үйлчилгээ бөгөөд бид маршрутыг хянахад ашигладаг. 
//Хэрэв хэрэглэгч нэвтрээгүй бол AuthGuard-ийг ашиглан түүнийг /login хуудас руу чиглүүлдэг.

//canActivate(): Энэ арга нь хэрэглэгч тухайн маршрутад орж болох эсэхийг шалгадаг