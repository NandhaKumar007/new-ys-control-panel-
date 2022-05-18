import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-vendor-settlement',
  templateUrl: './vendor-settlement.component.html',
  styleUrls: ['./vendor-settlement.component.scss'],
  animations: [SharedAnimations]
})

export class VendorSettlementComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; filterForm: any = {};
  list: any = []; scrollPos: number = 0;

  constructor(private api: OrderService, public commonService: CommonService) { }

  ngOnInit() {
    this.filterForm = { vendor_id: 'all', list_type: 'pending' };
    if(sessionStorage.getItem("order_page")) {
      let pageInfo = JSON.parse(sessionStorage.getItem("order_page"));
      sessionStorage.removeItem("order_page");
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
      this.filterForm.list_type = pageInfo.filter_form.list_type;
    }
    this.getOrderList();
  }

  getOrderList() {
    this.list = [];
    this.pageLoader = true;
    this.api.SETTLEMENT_ORDERS(this.filterForm).subscribe(result => {
      if(result.status) {
        let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
        orderList.forEach(obj => {
          obj.vendor_id = obj.vendor_list.vendor_id;
          obj.order_number = obj.vendor_list.order_number;
          obj.delivered_on = obj.vendor_list.delivered_on;
          obj.final_price = obj.vendor_list.final_price;
          let vendorIndex = this.commonService.vendor_list.findIndex(el => el._id==obj.vendor_id);
          if(vendorIndex!=-1) obj.vendor_name = this.commonService.vendor_list[vendorIndex].company_details.brand;
          this.list.push(obj);
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
    });
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem("order_page", JSON.stringify(pageData));
  }

}