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
    bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>()

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
        const initialState:ModalOptions = {
            initialState: {
                list: [
                    'Do thing 1',
                    'Do thing 2',
                    'Do thing 3',
                    ],
                title: 'Modal with component',
            },
            class: 'modal-lg',
            focus: true,
            animated: true,

        }
        this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
        this.bsModalRef.content!.closeBtnName = 'Close';
    }

}
