import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-appointment-categories',
  templateUrl: './appointment-categories.component.html',
  styleUrls: ['./appointment-categories.component.scss'],
  animations: [SharedAnimations]
})

export class AppointmentCategoriesComponent implements OnInit {

  page = 1; pageSize = 5;
	list: any = [];
  pageLoader: boolean; search_bar: string;
  catForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.APPOINTMENT_CATEGORY_LIST().subscribe(result => {
			if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_APPOINTMENT_CATEGORY(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEdit(x, modalName) {
    this.catForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.catForm[key] = x[key];
    }
    if(this.catForm.image) this.catForm.exist_image = this.catForm.image;
    this.catForm.prev_rank = this.catForm.rank;
    this.modalService.open(modalName);
  }
  onSubmit() {
    this.catForm.submit = true;
    if(this.catForm.form_type=='add') {
      this.api.ADD_APPOINTMENT_CATEGORY(this.catForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.submit = false;
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_APPOINTMENT_CATEGORY(this.catForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.submit = false;
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.catForm.image = (<FileReader>event.target).result;
        this.catForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}