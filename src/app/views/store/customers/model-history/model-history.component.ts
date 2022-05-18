import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-model-history',
  templateUrl: './model-history.component.html',
  styleUrls: ['./model-history.component.scss'],
  animations: [SharedAnimations]
})

export class ModelHistoryComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; list: any= [];
  customerDetails: any= {};
  imgBaseUrl = environment.img_baseurl;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private customerApi: CustomerApiService,
    private activeRoute: ActivatedRoute, public commonService: CommonService) {
      config.backdrop = 'static'; config.keyboard = false;
    }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.list = [];
      this.customerDetails = JSON.parse(sessionStorage.getItem("customer_details"));
      this.customerApi.CUSTOMER_MODEL_HISTORY_LIST(params.id, params.model_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.updatedBy = "NA";
            if(obj.updated_by==this.commonService.store_details._id) obj.updatedBy = "Admin";
            else {
              let userIndex = this.commonService.user_list.findIndex(el => el._id==obj.updated_by);
              if(userIndex!=-1) obj.updatedBy = this.commonService.user_list[userIndex].name;
            }
          });
        }
        else console.log("response", result);
      });
    });
  }

}