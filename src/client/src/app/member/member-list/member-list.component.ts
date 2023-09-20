import { Component, OnInit } from '@angular/core';
import { MemberService } from "../../_services/member.service";
import {Member} from "../../_models/member";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
    members: Member[] = [];

    constructor(private memberService: MemberService){

    }
    ngOnInit(): void {
        this.loadMembers();
    }

    loadMembers(){
        this.memberService.getMembers().subscribe({
            next: members => this.members = members,
        })
    }

}
