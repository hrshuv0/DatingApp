import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AccountService} from "./_services/account.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Dating App';
    users: any;

    constructor(private http: HttpClient, private accountService: AccountService) {
    }

    ngOnInit(): void {
        this.getUsers();
        this.setCurrentUser();
    }

    getUsers() {
        this.http.get('https://localhost:5001/api/users').subscribe({
            next: response => this.users = response,
            error: err => console.log(err),
            complete: () => console.log('complete')
        })
    }

    setCurrentUser() {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user: any = JSON.parse(userString);
            this.accountService.setCurrentUser(user);
        }
    }


}
