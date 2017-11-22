import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// npm install angular2-flash-messages --save
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMsg: FlashMessagesService
  ) { }

  onLogoutClick() {
    this.authService.logout();
    this.flashMsg.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }
  ngOnInit() {
  }

}
