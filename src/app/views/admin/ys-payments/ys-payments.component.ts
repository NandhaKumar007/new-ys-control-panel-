import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-payments',
  templateUrl: './ys-payments.component.html',
  styleUrls: ['./ys-payments.component.scss'],
  animations: [SharedAnimations]
})

export class YsPaymentsComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; scrollPos: number = 0;
  filterForm: any = { type: 'all', from_date: new Date(), to_date: new Date() };
  list: any = []; params: any = {};

  constructor(private activeRoute: ActivatedRoute, private api: AdminApiService, public commonService: CommonService) {
    let startDate = new Date(new Date().setHours(0,0,0,0));
    this.filterForm.from_date = new Date(startDate.setDate(startDate.getDate() - 30));
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.filterForm.from_date && this.filterForm.to_date) {
        if(this.filterForm.to_date == new Date) this.filterForm.to_date = new Date(new Date().setMinutes(new Date().getMinutes() - 10));
        this.pageLoader = true;
        let fromDate = new Date(this.filterForm.from_date).setHours(0,0,0,0);
        let toDate = new Date(this.filterForm.to_date).setHours(23,59,59,999);
        this.api.PAYMENTS({ list_type: this.params.type, type: this.filterForm.type, from_date: fromDate, to_date: toDate }).subscribe(result => {
          if(result.status) {
            this.list = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
            this.list.forEach(obj => {
              if(obj.storeDetails && obj.storeDetails.length) {
                obj.store_id = obj.storeDetails[0]._id;
                obj.store_name = obj.storeDetails[0].name;
                obj.store_email = obj.storeDetails[0].email;
              }
              else obj.customer_email = obj.guest_email;
            });
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
        });
      }
    });
  }

}