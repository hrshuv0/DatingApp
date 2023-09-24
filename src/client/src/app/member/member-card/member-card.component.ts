import {Component, Input, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {MemberService} from "../../_services/member.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit{
    @Input() member! : Member;

    constructor(private memberService: MemberService,
                private toastr: ToastrService) {

    }
    ngOnInit(): void {
    }

    addLike(member: Member){
        this.memberService.addLike(member.userName).subscribe({
            next: () => {
                this.toastr.success('You have liked ' + member.knownAs);
            }
        })
    }

}
