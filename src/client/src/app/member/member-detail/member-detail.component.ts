import {Component, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MemberService} from "../../_services/member.service";
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "@kolkov/ngx-gallery";
import {TabDirective, TabsetComponent} from "ngx-bootstrap/tabs";
import {MessageService} from "../../_services/message.service";
import {Message} from "../../_models/message";

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    @ViewChild('memberTabs') memberTabs!: TabsetComponent;
    member: Member | undefined;
    galleryOptions: NgxGalleryOptions[] = [];
    galleryImages: NgxGalleryImage[] = [];
    activeTab!: TabDirective;
    messages: Message[] = [];

    constructor(private memberService: MemberService,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.loadMember();

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ];
    }

    getImages(): NgxGalleryImage[] {
        if(!this.member)return [];

        const imageUrls = [];
        for (const photo of this.member?.photos!) {
            imageUrls.push({
                small: photo?.url,
                medium: photo?.url,
                big: photo?.url
            })
        }
        return imageUrls;
    }

    loadMember() {
        const username = this.route.snapshot.paramMap.get('username');
        if (!username) return;

        this.memberService.getMember(username).subscribe({
            next: member => {
                this.member = member;
                this.galleryImages = this.getImages();
            }
        })
    }

    onTabActivated(data: TabDirective){
        this.activeTab = data;
        if(this.activeTab.heading === 'Messages'){
            this.loadMessages();
        }
    }


    loadMessages(){
        if(this.member){
            this.messageService.getMessageThread(this.member.userName).subscribe({
                next: messages => {
                    this.messages = messages;
                }
            });
        }
    }


}
