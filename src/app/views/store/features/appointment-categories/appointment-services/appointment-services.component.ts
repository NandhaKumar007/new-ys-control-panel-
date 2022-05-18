import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-appointment-services',
  templateUrl: './appointment-services.component.html',
  styleUrls: ['./appointment-services.component.scss'],
  animations: [SharedAnimations]
})

export class AppointmentServicesComponent implements OnInit {

  page = 1; pageSize = 5;
	category_details: any = {}; params: any = {};
  pageLoader: boolean; search_bar: string;
  deleteForm: any;
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private activeRoute: ActivatedRoute, config: NgbModalConfig, public modalService: NgbModal,
    private router: Router, private api: FeaturesApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.api.APPOINTMENT_CATEGORY_DETAILS(this.params.category_id).subscribe(result => {
        if(result.status) this.category_details = result.data;
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  // DELETE
  onDelete() {
    this.deleteForm.category_id = this.category_details._id;
    this.api.DELETE_APPOINTMENT_SERVICES(this.deleteForm).subscribe(result => {
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

}