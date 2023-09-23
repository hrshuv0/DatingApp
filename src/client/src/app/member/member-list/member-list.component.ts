import { Component, OnInit } from '@angular/core';
import { MemberService } from "../../_services/member.service";
import {Member} from "../../_models/member";
import {Observable, take} from "rxjs";
import {Pagination} from "../../_models/pagination";
import {UserParams} from "../../_models/userParams";
import {User} from "../../_models/user";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
    // members$!: Observable<Member[]>;
    members: Member[] = [];
    pagination!: Pagination;
    userParams!: UserParams;
    genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];


    constructor(private memberService: MemberService){
        this.userParams = this.memberService.getUserParams();
    }

    ngOnInit(): void {
        // this.members$ = this.memberService.getMembers();
        this.loadMembers();
    }

    loadMembers(){
        if(this.userParams) {
            this.memberService.setUserParams(this.userParams);
            this.memberService.getMembers(this.userParams).subscribe({
                next: response => {
                    this.members = response.result;
                    this.pagination = response.pagination;
                }
            })
        }
    }

    resetFilters(){
        this.userParams = this.memberService.resetUserParams()!;
        this.loadMembers();
    }


    pageChanged($event: any) {
        if(this.userParams.pageNumber === $event.page) return;
        this.userParams.pageNumber = $event.page;
        this.memberService.setUserParams(this.userParams);
        this.loadMembers();
    }





}
