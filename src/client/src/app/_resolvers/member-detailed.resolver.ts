import {ActivatedRouteSnapshot, Resolve, ResolveFn} from '@angular/router';
import {Member} from "../_models/member";
import {inject, Inject} from "@angular/core";
import {MemberService} from "../_services/member.service";
import {Observable} from "rxjs";

export const MemberDetailedResolver: ResolveFn<Member> = (route, state) => {
    let memberService = inject(MemberService);

    return memberService.getMember(route.params['username']);
};

export class MemberDetailedResolver2 implements Resolve<Member> {
    constructor(private memberService: MemberService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Member>{
        return this.memberService.getMember(route.paramMap.get('username')!);
    }

}
