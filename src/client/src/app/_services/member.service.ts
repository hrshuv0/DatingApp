import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.development";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Member } from "../_models/member";
import {map, Observable, of} from "rxjs";
import {PaginatedResult} from "../_models/pagination";

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];
    paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

    constructor(private http: HttpClient) {
    }

    getMembers(page?: number, itemsPerPage?: number): Observable<any> {
        let params = new HttpParams();
        if(page && itemsPerPage){
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }

        //if(this.members.length > 0) return of(this.members);
        return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
            map((response: any) => {
                this.paginatedResult.result = response.body!;
                if(response.headers.get('Pagination') !== null){
                    this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
                }
                return this.paginatedResult;
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





}
