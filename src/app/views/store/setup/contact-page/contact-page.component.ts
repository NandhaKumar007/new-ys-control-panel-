import { Component, OnInit } from '@angular/core';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})

export class ContactPageComponent implements OnInit {

  pageLoader: boolean;
  formData: any = {}; editForm: any = {};

  constructor(private api: SetupService) { }

  ngOnInit(): void {
    this.pageLoader = true; delete this.editForm;
    this.api.CONTACT_PAGE_DETAILS().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.formData = result.data;
      else this.formData = { heading: "SAY HELLO", sub_heading: "Feel free to get in touch with us." };
    });
  }

  onEdit() {
    this.editForm = { heading: this.formData.heading, sub_heading: this.formData.sub_heading, address: "" };
    if(this.formData._id) {
      this.editForm = {
        heading: this.formData.heading, sub_heading: this.formData.sub_heading,
        to_mail: this.formData.to_mail, map_url: this.formData.map_url, address: this.formData.address
      };
    }
  }
  onUpdate() {
    this.api.UPDATE_CONTACT_PAGE(this.editForm).subscribe(result => {
      if(result.status) this.ngOnInit();
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  cancel() {
    delete this.editForm;
  }

}