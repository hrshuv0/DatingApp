import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.development";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Member } from "../_models/member";
import {map, Observable, of} from "rxjs";
import {PaginatedResult} from "../_models/pagination";
import {UserParams} from "../_models/userParams";

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];

    constructor(private http: HttpClient) {
    }

    getMembers(userParams: UserParams): Observable<any> {
        let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params);
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
        const member = this.members.find(x => x.userName === username);
        if(member) return of(member);

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




}
