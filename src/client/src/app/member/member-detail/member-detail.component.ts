import {Component, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MemberService} from "../../_services/member.service";

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    member: Member | undefined;

    constructor(private memberService: MemberService,
                private toastr: ToastrService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadMember();
    }

    loadMember() {
        const username = this.route.snapshot.paramMap.get('username');
        if (!username) return;

        this.memberService.getMember(username).subscribe({
            next: member => {
                this.member = member;
            }
        })


    }


}
