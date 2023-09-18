import {Component, OnInit} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
    model: any = {};
    loggedIn: boolean = false;

    constructor(private accountService: AccountService, private router: Router) {
    }

    ngOnInit(): void {
        this.getCurrentUser();
    }

    getCurrentUser() {
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.loggedIn = !!user;
            },
            error: error => {
                console.log(error);
            }
        });
    }

    login() {
        this.accountService.login(this.model).subscribe({
            next: () => {
                this.loggedIn = true;
                this.router.navigateByUrl('/members');
            },
            error: error => {
                console.log(error);
            }
        });
    }

    logout() {
        this.accountService.logout();
        this.loggedIn = false;
        this.router.navigateByUrl('/');
    }

}
