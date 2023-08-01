import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoService } from '../photo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private ps: PhotoService) { }
  async canActivate(): Promise<boolean | UrlTree> {
    try {
      const currentUser = await this.ps.loginUsers();
      console.log('currentUser', currentUser);
      if (currentUser) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }
    catch (error: any) {
      this.router.navigate(['/']);
      return false;
    }
  }
}
export const canActivateTeam: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthGuard).canActivate();
  }
  

