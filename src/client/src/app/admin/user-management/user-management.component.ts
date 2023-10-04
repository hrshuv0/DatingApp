import {Component, OnInit} from '@angular/core';
import {User} from "../../_models/user";
import {AdminService} from "../../_services/admin.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {RolesModalComponent} from "../../modals/roles-modal/roles-modal.component";

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
    availableRoles = [
        'Admin',
        'Moderator',
        'Member'
    ];

    constructor(private adminService: AdminService, private  modalService: BsModalService) {

    }

    ngOnInit(): void {
        this.getUsersWithRoles();
    }

    getUsersWithRoles() {
        this.adminService.getUsersWithRoles().subscribe({
            next: users => {
                this.users = users!;
            }
        })
    }

    openRolesModal(user: User) {
        const config:ModalOptions = {
            class: 'modal-dialog-top',
            focus: true,
            animated: true,
            initialState: {
                username: user.username,
                availableRoles: this.availableRoles,
                selectedRoles: [...user.roles]
            }

        }
        this.bsModalRef = this.modalService.show(RolesModalComponent, config);
        this.bsModalRef.onHide?.subscribe({
            next: () => {
                const selectedRoles = this.bsModalRef.content?.selectedRoles;
                if(!this.arrayEqual(selectedRoles!, user.roles)){
                    this.adminService.updateUserRoles(user.username, selectedRoles!.join(',')).subscribe({
                        next: roles => {
                            user.roles = [...roles];
                            this.getUsersWithRoles();
                        }
                    });

            }
        }});
        // this.bsModalRef.content!.closeBtnName = 'Close';
    }

    private arrayEqual(arr1: any[], arr2: any[]){
        return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());

        // if(arr1.length !== arr2.length) return false;
        // for(let i = 0; i < arr1.length; i++){
        //     if(arr1[i] !== arr2[i]) return false;
        // }
        // return true;
    }

}
