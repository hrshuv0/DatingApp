import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "@kolkov/ngx-gallery";
import {TabDirective, TabsetComponent} from "ngx-bootstrap/tabs";
import {MessageService} from "../../_services/message.service";
import {Message} from "../../_models/message";
import {PresenceService} from "../../_services/presence.service";
import {AccountService} from "../../_services/account.service";
import {User} from "../../_models/user";
import {take} from "rxjs";

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy{
    @ViewChild('memberTabs', {static:true}) memberTabs!: TabsetComponent;
    member: Member = {} as Member;
    galleryOptions: NgxGalleryOptions[] = [];
    galleryImages: NgxGalleryImage[] = [];
    activeTab!: TabDirective;
    messages: Message[] = [];
    user!: User;

    constructor(private accountService: AccountService,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private messageService: MessageService,
                public presenceService: PresenceService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: user => {
                this.user = user;
            }
        });
    }

    ngOnInit(): void {
        //this.loadMember();
        this.route.data.subscribe({
            next: data => {
                this.member = data['member'];
            }
        });

        this.route.queryParams.subscribe({
            next: params => {
                params['tab'] && this.selectTab(params['tab']);
            }
        });

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

        this.galleryImages = this.getImages();
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

    // loadMember() {
    //     const username = this.route.snapshot.paramMap.get('username');
    //     if (!username) return;
    //
    //     this.memberService.getMember(username).subscribe({
    //         next: member => {
    //             this.member = member;
    //             this.galleryImages = this.getImages();
    //         }
    //     })
    // }

    onTabActivated(data: TabDirective){
        this.activeTab = data;
        if(this.activeTab.heading === 'Messages' && this.user){
            this.messageService.createHubConnection(this.user, this.member.userName);
        }
        else{
            this.messageService.stopHubConnection();
        }
    }

    selectTab(heading:string){
        if(this.memberTabs){
            this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
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

    ngOnDestroy(): void {
        this.messageService.stopHubConnection();
    }


}
