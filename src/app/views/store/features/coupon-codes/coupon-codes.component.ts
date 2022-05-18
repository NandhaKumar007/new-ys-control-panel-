import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-coupon-codes',
  templateUrl: './coupon-codes.component.html',
  styleUrls: ['./coupon-codes.component.scss'],
  animations: [SharedAnimations]
})

export class CouponCodesComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; search_bar: any;
  parent_list: any = []; list: any = [];
  deleteForm: any; list_type: any = "all";

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.OFFER_LIST().subscribe(result => {
      if(result.status) {
        this.parent_list = result.list;
        this.list = result.list;
        this.list.forEach(obj => {
          obj.code_status='Active';
          if(obj.valid_to) {
            if(new Date() > new Date(obj.valid_to)) obj.code_status='Expired';
          }
          if(!obj.enable_status) obj.code_status='Inactive';
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  filterList(type) {
    this.page = 1;
    if(type=='all') this.list = this.parent_list;
    else this.list = this.parent_list.filter(obj => obj.code_status==type);
  }

  // DELETE
  onDelete() {
    this.api.DELETE_OFFER(this.deleteForm).subscribe(result => {
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