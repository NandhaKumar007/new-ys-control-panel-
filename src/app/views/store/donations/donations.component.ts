import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss'],
  animations: [SharedAnimations]
})

export class DonationsComponent implements OnInit {

  pageLoader: boolean; search_bar: string; exportLoader: boolean;
  page = 1; pageSize = 10;
  filterForm: any = {}; list: any = [];

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.pageLoader = true;
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getDonationList();
  }

  getDonationList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.api.DONATION_LIST(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.customer_name = 'NA';
            obj.customer_email = 'NA';
            if(obj.customerDetails.length) {
              obj.customer_name = obj.customerDetails[0].name;
              obj.customer_email = obj.customerDetails[0].email;
            }
          });
        }
        else console.log("response", result);
      });
    }
  }

}