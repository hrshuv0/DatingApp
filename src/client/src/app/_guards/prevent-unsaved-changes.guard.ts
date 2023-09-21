import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from "../member/member-edit/member-edit.component";

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (
    component: MemberEditComponent): boolean => {
    if (component.editForm.dirty) {
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
    }
    return true;
};
