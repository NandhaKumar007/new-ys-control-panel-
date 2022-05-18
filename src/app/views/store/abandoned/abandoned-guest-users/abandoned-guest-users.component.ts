import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-abandoned-guest-users',
  templateUrl: './abandoned-guest-users.component.html',
  styleUrls: ['./abandoned-guest-users.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedGuestUsersComponent implements OnInit {

  page = 1; pageSize = 10;
  filterForm: any = { search: "" }; totalPages: number = 0;
  pagesList: any = []; list: any = [];
  pageLoader: boolean;

  constructor(private customerApi: CustomerApiService, public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.page = 1;
    if(this.commonService.page_attr && this.commonService.page_attr.type=='abandoned_guest_user') {
      let pageAttr = this.commonService.page_attr;
      this.page = pageAttr.page;
      this.filterForm.search = pageAttr.search;
      delete this.commonService.page_attr;
    }
    this.pageLoader = true;
    this.commonService.pageTop(0);
    this.onLoadData();
  }

  onLoadData() {
    this.filterForm.skip = (this.page-1)*this.pageSize; this.filterForm.limit = this.pageSize;
    this.customerApi.ABANDONED_GUEST_USERS(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(element => {
          element.name = "NA";
          element.mobile = "NA";
          if(element.address_list.length) {
            element.name = element.address_list[0].name;
            element.mobile = element.address_list[0].mobile;
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(element.address_list[0].dial_code) element.mobile = element.address_list[0].dial_code+" "+element.mobile;
          }
          element.cart_total = this.calcCartTotal(element.cart_list);
        });
        this.totalPages = Math.ceil(result.count/this.pageSize);
        this.pagesList = new Array(this.totalPages);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onChangePage(type) {
    this.commonService.pageTop(0);
    if(type=='prev') this.page--;
    else this.page++;
    this.onLoadData();
  }

  calcCartTotal(itemList) {
    return itemList.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue['final_price'] * currentValue['quantity']);
    }, 0);
  }

  catchPageData() {
    this.commonService.page_attr = {
      type: 'abandoned_guest_user', page: this.page, search: this.filterForm.search,
      scroll_pos: this.commonService.scroll_y_pos
    };
  }

}