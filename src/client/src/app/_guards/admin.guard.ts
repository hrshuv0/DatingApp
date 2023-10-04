import {CanActivateFn} from '@angular/router';
import {AccountService} from "../_services/account.service";
import {inject} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {map, Observable} from "rxjs";

export const AdminGuard: CanActivateFn = (route, state): Observable<boolean> => {
    const accountService:AccountService = inject(AccountService);
    const toastr:ToastrService = inject(ToastrService);

    return accountService.currentUser$.pipe(
        map(user => {
            if(!user) return false;
            if(user.roles.includes('Admin') || user.roles.includes('Moderator')) {
                return true;
            }
            else{
                toastr.error('You cannot access this area!');
                return false;
            }
        })
    );
};
