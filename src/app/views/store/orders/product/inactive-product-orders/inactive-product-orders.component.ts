import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-inactive-product-orders',
  templateUrl: './inactive-product-orders.component.html',
  styleUrls: ['./inactive-product-orders.component.scss'],
  animations: [SharedAnimations]
})

export class InactiveProductOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; scrollPos: number = 0;
  filterForm: any = { type: 'All', from_date: new Date(), to_date: new Date() };
  list: any = [];

  constructor(private api: OrderService, public commonService: CommonService) { }

  ngOnInit() {
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
    }
    if(this.filterForm.from_date && this.filterForm.to_date) {
      if(this.filterForm.to_date == new Date) this.filterForm.to_date = new Date(new Date().setMinutes(new Date().getMinutes() - 10));
      this.pageLoader = true;
      this.api.INACTIVE_ORDER_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
          this.list.forEach(obj => {
            if(obj.shipping_address) obj.shipping_customer_name = obj.shipping_address.name;
            if(obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
            if(obj.customerDetails.length) {
              obj.customer_name = obj.customerDetails[0].name;
              obj.customer_email = obj.customerDetails[0].email;
              obj.customer_mobile = obj.customerDetails[0].mobile;
            }
            else obj.customer_email = obj.guest_email;
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
      });
    }
  }

  checkOrderStatus(x) {
    x.loader = true;
    if(x.payment_details.name=="CCAvenue") {
      this.api.CCAVENUE_PAYMENT_STATUS({ type: 'product', _id: x._id }).subscribe(result => {
        x.loader = false;
        this.ngOnInit();
        if(!result.status) console.log("response", result);
      });
    }
    else if(x.payment_details.name=="Razorpay") {
      this.api.RAZORPAY_PAYMENT_STATUS({ type: 'product', _id: x._id }).subscribe(result => {
        x.loader = false;
        this.ngOnInit();
        if(!result.status) console.log("response", result);
      });
    }
    else {
      x.loader = false;
      console.log("service not available for this payment");
    }
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem("inactive_order_page", JSON.stringify(pageData));
  }

}