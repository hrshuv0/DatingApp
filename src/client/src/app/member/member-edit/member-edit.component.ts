import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import {User} from "../../_models/user";
import {AccountService} from "../../_services/account.service";
import {MemberService} from "../../_services/member.service";
import {take} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit{
    @ViewChild('editForm') editForm!: NgForm;
    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if(this.editForm.dirty) {
            $event.returnValue = true;
        }
    }
    member!: Member;
    user!: User;
    constructor(private accountService: AccountService,
                private memberService: MemberService,
                private toastr: ToastrService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: user => this.user = user
        });
    }
    ngOnInit(): void {
        this.loadMember();
    }

    loadMember() {
        if(!this.user) return;
        this.memberService.getMember(this.user.username).subscribe({
            next: member => this.member = member
        });
    }

    updateMember() {
        this.memberService.updateMember(this.member).subscribe({
            next: () => this.toastr.success('Profile updated successfully'),
            error: error => console.log(error),
            complete: () => this.editForm.reset(this.member)
        });
    }

}
