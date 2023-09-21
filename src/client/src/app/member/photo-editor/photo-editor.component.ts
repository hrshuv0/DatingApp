import {Component, Input, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../environments/environment.development";
import {User} from "../../_models/user";
import {AccountService} from "../../_services/account.service";
import {MemberService} from "../../_services/member.service";
import {ToastrService} from "ngx-toastr";
import {take} from "rxjs";

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit{
    @Input() member!: Member;
    uploader!: FileUploader;
    hasBaseDropZoneOver = false;
    baseUrl = environment.apiUrl;
    user!: User;

    constructor(private accountService: AccountService,
                private memberService: MemberService,
                private toastr: ToastrService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user: User) => {
                if(user) this.user = user;
            }
        });
    }

    ngOnInit(): void {
        this.initializeUploader();
    }

    fileOverBase(event: any) {
        this.hasBaseDropZoneOver = event;
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url: this.baseUrl + "users/add-photo",
            authToken: `Bearer ${this.user.token}`,
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024 // 10 MB
        });

        this.uploader.onAfterAddingFile = (file) =>{
            file.withCredentials = false;
        }

        this.uploader.onSuccessItem = (item, response, status, headers) =>{
            if(response){
                const photo = JSON.parse(response);
                this.member.photos.push(photo);
                // if(photo.isMain){
                //     this.user.photoUrl = photo.url;
                //     this.member.photoUrl = photo.url;
                //     this.accountService.setCurrentUser(this.user);
                // }
            }
        }

    }

}
