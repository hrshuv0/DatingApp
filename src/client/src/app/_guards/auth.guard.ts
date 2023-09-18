import {CanActivateFn, Router} from '@angular/router';
import {map, Observable} from "rxjs";
import {inject} from "@angular/core";
import {AccountService} from "../_services/account.service";
import {ToastrService} from "ngx-toastr";

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean> => {

    const router: Router = inject(Router);
    const accountService: AccountService = inject(AccountService);
    const toastr: ToastrService = inject(ToastrService);

    return accountService.currentUser$.pipe(
        map(user => {
            if (user) {
                return true;
            }

            toastr.error('You shall not pass!');
            // router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});

            return false;
        }
        )
    );
};
