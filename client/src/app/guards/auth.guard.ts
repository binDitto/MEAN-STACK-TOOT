import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMsg: FlashMessagesService
  ) {}

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      // redirects back to guarded page they wanted to access.
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      // this.flashMsg.show('You are not logged in.', { cssClass: 'alert alert-danger'});
      // ^^ implemented in logincomponent
      return false;
    }
  }
}
