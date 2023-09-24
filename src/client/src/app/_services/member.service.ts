import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Member } from "../_models/member";
import { map, Observable, of, take } from "rxjs";
import { PaginatedResult } from "../_models/pagination";
import { UserParams } from "../_models/userParams";
import { AccountService } from "./account.service";
import { User } from "../_models/user";

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];
    memberCache = new Map();
    userParams!: UserParams;
    user!: User;

    constructor(private http: HttpClient, private accountService: AccountService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: user => {
                if(user){
                    this.userParams = new UserParams(user);
                    this.user = user;
                }
            }
        });
    }

    getUserParams(){
        return this.userParams;
    }

    setUserParams(params: UserParams){
        this.userParams = params;
    }

    resetUserParams(){
        if(this.user){
            this.userParams = new UserParams(this.user);
            return this.userParams;
        }
        return;
    }

    getMembers(userParams: UserParams): Observable<any> {
        const response = this.memberCache.get(Object.values(userParams).join('-'));
        if(response){
            return of(response);
        }

        let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
            map(response => {
                this.memberCache.set(Object.values(userParams).join('-'), response);
                return response;
            })
        );
    }

    private getPaginatedResult<T>(url: string, params: HttpParams) {
        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

        return this.http.get<T>(url, {observe: 'response', params}).pipe(
            map((response: any) => {
                paginatedResult.result = response.body!;
                if(response.headers.get('Pagination') !== null){
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
                }
                return paginatedResult;
            })
        );
    }

    getMember(username: string) {
        const member = [...this.memberCache.values()]
            .reduce((arr, elem) => arr.concat(elem.result), [])
            .find((member: Member) => member.userName === username);

        if(member){
            return of(member);
        }

        return this.http.get<Member>(this.baseUrl + 'users/' + username);
    }

    updateMember(member: Member) {
        return this.http.put(this.baseUrl + 'users', member).pipe(
            map(() => {
                const index = this.members.indexOf(member);
                this.members[index] = {...this.members[index], ...member};
            })
        );
    }

    setMainPhoto(photoId: number) {
        return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
    }

    deletePhoto(photoId: number) {
        return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
    }

    getPaginationHeaders(pageNumber: number, pageSize: number){
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);

        return params;
    }

    addLike(username: string) {
        return this.http.post(this.baseUrl + 'likes/' + username, {});
    }

    getLikes(predicate: string) {
        let params = new HttpParams()
        params = params.append('predicate', predicate);

        return this.http.get<Member[]>(this.baseUrl + 'likes', {params})
    }




}
