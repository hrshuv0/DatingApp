import {Component, OnInit} from '@angular/core';
import {Member} from "../_models/member";
import {MemberService} from "../_services/member.service";
import {Pagination} from "../_models/pagination";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{
    members!: Member[];
    predicate = 'liked';
    pageNumber = 1;
    pageSize = 5;
    pagination!: Pagination;

    constructor(private memberService: MemberService) {

    }
    ngOnInit(): void {
        this.loadLikes();
    }

    loadLikes(){
        this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
            next: response => {
                this.members = response.result;
                this.pagination = response.pagination;
            }
        });
    }

    pageChanged($event: any) {
        if(this.pageNumber === $event.page) return;
        this.pageNumber = $event.page;
        this.loadLikes();
    }

}
