import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {User} from "../_models/user";
import {environment} from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    baseUrl = environment.apiUrl;
    private currentUserSource = new BehaviorSubject<User>(null!);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(private http: HttpClient) {
    }

    login(model: any):Observable<any> {
        return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
            map((response: User) => {
                const user = response;
                if (user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    register(model: any):Observable<any> {
        return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
            map((user: User) => {
                if (user) {
                    this.setCurrentUser(user);
                }
            })
        );
    }

    setCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUserSource.next(null!);
    }




}
