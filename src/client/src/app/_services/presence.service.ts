import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {ToastrService} from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class PresenceService {
    hubUrl = environment.hubUrl;
    private hubConnection!: HubConnection;

    constructor(private toastr: ToastrService) {
    }

    createHubConnection(user: any) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'presence', {
                accessTokenFactory: () => user.token
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('UserIsOnline', username => {
            this.toastr.info(username + ' has connected');
        });

        this.hubConnection.on('UserIsOffline', username => {
            this.toastr.warning(username + ' has disconnected');
        });

    }

    stopHubConnection() {
        this.hubConnection.stop().catch(error => console.log(error));
    }


}
