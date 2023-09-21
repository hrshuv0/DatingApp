import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule } from "ngx-toastr";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxGalleryModule } from "@kolkov/ngx-gallery";
import { NgxSpinnerModule } from "ngx-spinner";


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
        })
    ],
    exports:[
        BsDropdownModule,
        ToastrModule,
        TabsModule,
        NgxGalleryModule,
        NgxSpinnerModule
    ]
})
export class SharedModule {
}
