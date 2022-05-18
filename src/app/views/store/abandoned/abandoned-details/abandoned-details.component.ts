import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-abandoned-details',
  templateUrl: './abandoned-details.component.html',
  styleUrls: ['./abandoned-details.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedDetailsComponent implements OnInit {

  customer_details: any = {};
  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private activeRoute: ActivatedRoute, private customerApi: CustomerApiService,
    public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      if(this.router.url.indexOf('guest')!=-1) {
        this.customerApi.GUEST_USER_DETAILS(params.customer_id).subscribe(result => {
          if(result.status) {
            this.customer_details = result.data;
            this.customer_details.name = "NA";
            this.customer_details.mobile = "NA";
            if(this.customer_details.address_list.length) {
              this.customer_details.name = this.customer_details.address_list[0].name;
              this.customer_details.mobile = this.customer_details.address_list[0].dial_code+" "+this.customer_details.address_list[0].mobile;
            }
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else {
        this.customerApi.CUSTOMER_DETAILS(params.customer_id).subscribe(result => {
          if(result.status) {
            this.customer_details = result.data;
            if(!this.customer_details.mobile) {
              if(this.customer_details.address_list.length) {
                let filteredAddress = this.customer_details.address_list.filter(obj => obj.billing_address);
                this.customer_details.mobile = filteredAddress[0].dial_code+" "+filteredAddress[0].mobile;
              }
              else this.customer_details.mobile = "NA";
            }
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }

}