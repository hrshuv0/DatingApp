import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../_models/message";
import {MessageService} from "../../_services/message.service";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit{
    @Input() username!: string;
    @Input() messages: Message[] = [];

    constructor(private messageService: MessageService) {
    }

    ngOnInit(): void {
    }





}
