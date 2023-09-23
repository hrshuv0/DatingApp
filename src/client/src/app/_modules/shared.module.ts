import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule } from "ngx-toastr";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxGalleryModule } from "@kolkov/ngx-gallery";
import { NgxSpinnerModule } from "ngx-spinner";
import { FileUploadModule } from "ng2-file-upload";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
        }),
        NgxGalleryModule,
        NgxSpinnerModule.forRoot({
            type: 'square-jelly-box',
        }),
        FileUploadModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot()
    ],
    exports:[
        BsDropdownModule,
        ToastrModule,
        TabsModule,
        NgxGalleryModule,
        NgxSpinnerModule,
        FileUploadModule,
        BsDatepickerModule,
        PaginationModule,
        ButtonsModule
    ]
})
export class SharedModule {
}
