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
    user!: User;


    constructor(private memberService: MemberService, private accountService: AccountService){
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: user => {
                if(user){
                    this.userParams = new UserParams(user);
                    this.user = user;
                }
            }
        });
    }

    ngOnInit(): void {
        // this.members$ = this.memberService.getMembers();
        this.loadMembers();
    }

    loadMembers(){
        if(!this.userParams) return;

        this.memberService.getMembers(this.userParams).subscribe({
            next: response => {
                this.members = response.result;
                this.pagination = response.pagination;
            }
        })
    }


    pageChanged($event: any) {
        if(this.userParams.pageNumber === $event.page) return;
        this.userParams.pageNumber = $event.page;
        this.loadMembers();
    }





}
