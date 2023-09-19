import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private toastr: ToastrService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            if (error.error.errors) {
                                const modalStateErrors = [];
                                for (const key in error.error.errors) {
                                    if (error.error.errors[key]) {
                                        modalStateErrors.push(error.error.errors[key]);
                                    }
                                }
                                throw modalStateErrors.flat();
                            } else if (typeof (error.error) === 'object') {
                                this.toastr.error(error.statusText, error.status.toString());
                            } else {
                                this.toastr.error(error.error, error.status.toString());
                            }
                            break;
                        case 401:
                            this.toastr.error("Unauthorized", error.status.toString());
                            break;
                        case 404:
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            const navigationExtras = {state: {error: error.error}};
                            this.router.navigateByUrl('/server-error', navigationExtras);
                            break;
                        default:
                            this.toastr.error('Something unexpected went wrong');
                            console.log(error);
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }
}
