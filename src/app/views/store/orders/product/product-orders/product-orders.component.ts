import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CookieService } from 'ngx-cookie-service';
import { OrderService } from '../../order.service';
import { ExcelService } from '../../../../../services/excel.service';
import { CommonService } from '../../../../../services/common.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { FieldSearchPipe } from '../../../../../shared/pipes/field-search.pipe';
import { environment } from '../../../../../../environments/environment';
declare const Notification: any;

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.component.html',
  styleUrls: ['./product-orders.component.scss'],
  animations: [SharedAnimations]
})

export class ProductOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; exportLoader: boolean;
  params: any = {}; filterForm: any = {};
  list: any = []; scrollPos: number = 0;
  orderTypes: any = [];

  constructor(
    private api: OrderService, private activeRoute: ActivatedRoute, private excelService: ExcelService, private datePipe: DatePipe, private cookieService: CookieService,
    public commonService: CommonService, private swPush: SwPush, config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    // this.cookieService.set('blockSub', 'true');
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.page = 1; this.pageSize = 10;
      if(this.params.type=='live') this.orderTypes = ['placed', 'confirmed', 'dispatched'];
      if(this.params.type=='delivered') this.orderTypes = ['delivered'];
      if(this.params.type=='cancelled') this.orderTypes = ['cancelled'];
      if(!environment.keep_login && !this.commonService.ios && !this.cookieService.check('blockSub') && !this.commonService.master_token && this.commonService.store_details.login_type=='admin' && this.params.type=='live' && this.swPush.isEnabled) {
        if(Notification.permission=='default') document.getElementById('openSubModal').click();
        else if(Notification.permission=='granted' && !sessionStorage.getItem("sw_sub")) this.reqSub();
      }
      this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: this.params.type, vendor_id: 'all' };
      if(this.params.type=='live') this.filterForm.type = 'all';
      if(this.commonService.store_details.login_type=='vendor') {
        this.filterForm.vendor_id = this.commonService.vendor_details?._id;
      }
      this.filterForm.customer_id = this.params.customer_id;
      if(sessionStorage.getItem("order_page")) {
        let pageInfo = JSON.parse(sessionStorage.getItem("order_page"));
        sessionStorage.removeItem("order_page");
        this.scrollPos = pageInfo.scroll_pos;
        this.page = pageInfo.page_no;
        this.search_bar = pageInfo.search;
        this.filterForm.type = pageInfo.filter_form.type;
        if(pageInfo.filter_form.vendor_id) this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
        if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
        if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      }
      this.getOrderList();
    });
  }

  getOrderList() {
    this.list = [];
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      this.filterForm.date_type = 'created_on';
      if(this.filterForm.customer_id.indexOf('@')!=-1) {
        this.filterForm.guest_email = this.filterForm.customer_id;
        this.api.GUEST_ORDER_LIST(this.filterForm).subscribe(result => {
          if(result.status) {
            let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
            orderList.forEach(obj => {
              if(obj.shipping_address) obj.shipping_customer_name = obj.shipping_address.name;
              if(obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
              if(!obj.customer_name) obj.customer_name = obj.shipping_address.name;
              obj.customer_email = obj.guest_email;
              obj.customer_mobile = obj.shipping_address.dial_code+" "+obj.shipping_address.mobile;
              // delivery time
              if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1 && obj.shipping_method.delivery_date && obj.shipping_method.delivery_time) {
                let delDate = obj.shipping_method.delivery_date.split(" (")[0];
                let delTime = obj.shipping_method.delivery_time.split(" - ")[0];
                obj.delivery_time = new Date(delDate+" "+delTime);
              }
              // vendor
              if(this.commonService.store_details.login_type=='vendor') {
                let venIndex = obj.vendor_list.findIndex(el => el.vendor_id==this.commonService.vendor_details?._id);
                if(venIndex!=-1) {
                  obj.order_number = obj.vendor_list[venIndex].order_number;
                  obj.order_status = obj.vendor_list[venIndex].order_status;
                  obj.final_price = obj.vendor_list[venIndex].final_price;
                }
              }
              else if(this.params.type=='live' && obj.vendor_list?.length) {
                let vendorLiveOrders = obj.vendor_list.filter(el => el.order_status!='delivered' && el.order_status!='cancelled');
                let confirmedCount = vendorLiveOrders.filter(el => el.confirmed_on).length;
                if(vendorLiveOrders.findIndex(el => el.order_status=='placed') != -1) {
                  if(confirmedCount>0) {
                    obj.order_status = confirmedCount+" out of "+vendorLiveOrders.length+" confirmed";
                  }
                }
                else if(vendorLiveOrders.findIndex(el => el.order_status=='confirmed') != -1 && vendorLiveOrders.findIndex(el => el.dispatched_on) == -1) {
                  obj.order_status = 'confirmed';
                  let vCount = vendorLiveOrders.filter(el => el.order_status!='confirmed').length;
                  if(vCount>0) obj.order_status = vCount+" out of "+vendorLiveOrders.length+" confirmed";
                }
                else if(vendorLiveOrders.findIndex(el => el.order_status=='dispatched') != -1) {
                  obj.order_status = 'dispatched';
                  let vCount = vendorLiveOrders.filter(el => el.order_status!='dispatched').length;
                  if(vCount>0) obj.order_status = vCount+" out of "+vendorLiveOrders.length+" dispatched";
                }
              }
              this.list.push(obj);
            });
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
        });
      }
      else {
        this.api.ORDER_LIST(this.filterForm).subscribe(result => {
          if(result.status) {
            let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
            orderList.forEach(obj => {
              if(obj.shipping_address) obj.shipping_customer_name = obj.shipping_address.name;
              if(obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
              if(obj.customerDetails.length) {
                if(!obj.customer_name) obj.customer_name = obj.customerDetails[0].name;
                obj.customer_email = obj.customerDetails[0].email;
                obj.customer_mobile = obj.shipping_address.mobile;
                if(obj.customerDetails[0].mobile) obj.customer_mobile = obj.customerDetails[0].mobile;
                else if(obj.order_type=='pickup') obj.customer_mobile = 'NA';
              }
              else {
                if(!obj.customer_name) obj.customer_name = obj.shipping_address.name;
                obj.customer_email = obj.guest_email;
                obj.customer_mobile = obj.shipping_address.mobile;
              }
              // delivery time
              if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1 && obj.shipping_method.delivery_date && obj.shipping_method.delivery_time) {
                let delDate = obj.shipping_method.delivery_date.split(" (")[0];
                let delTime = obj.shipping_method.delivery_time.split(" - ")[0];
                obj.delivery_time = new Date(delDate+" "+delTime);
              }
              // vendor
              if(obj.vendor_list?.length) {
                let tIndex = obj.vendor_list.findIndex(el => this.orderTypes.indexOf(el.order_status)!=-1);
                if(tIndex!=-1)
                {
                  if(this.commonService.store_details.login_type=='vendor') {
                    let venIndex = obj.vendor_list.findIndex(el => el.vendor_id==this.commonService.vendor_details?._id);
                    if(venIndex!=-1) {
                      obj.order_number = obj.vendor_list[venIndex].order_number;
                      obj.order_status = obj.vendor_list[venIndex].order_status;
                      obj.final_price = obj.vendor_list[venIndex].final_price;
                    }
                  }
                  else if(this.params.type=='live') {
                    let vendorLiveOrders = obj.vendor_list.filter(el => el.order_status!='delivered' && el.order_status!='cancelled');
                    let confirmedCount = vendorLiveOrders.filter(el => el.confirmed_on).length;
                    if(vendorLiveOrders.findIndex(el => el.order_status=='placed') != -1) {
                      if(confirmedCount>0) {
                        obj.order_status = confirmedCount+" out of "+vendorLiveOrders.length+" confirmed";
                      }
                    }
                    else if(vendorLiveOrders.findIndex(el => el.order_status=='confirmed') != -1 && vendorLiveOrders.findIndex(el => el.dispatched_on) == -1) {
                      obj.order_status = 'confirmed';
                      let vCount = vendorLiveOrders.filter(el => el.order_status!='confirmed').length;
                      if(vCount>0) obj.order_status = vCount+" out of "+vendorLiveOrders.length+" confirmed";
                    }
                    else if(vendorLiveOrders.findIndex(el => el.order_status=='dispatched') != -1) {
                      obj.order_status = 'dispatched';
                      let vCount = vendorLiveOrders.filter(el => el.order_status!='dispatched').length;
                      if(vCount>0) obj.order_status = vCount+" out of "+vendorLiveOrders.length+" dispatched";
                    }
                  }
                  this.list.push(obj);
                }
              }
              else this.list.push(obj);
            });
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
        });
      }
    }
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "";
    if(this.params.type=='live') fileName += "Live Orders from ";
    else if(this.params.type=='delivered') fileName += "Completed Orders from ";
    else if(this.params.type=='cancelled') fileName += "Cancelled Orders from ";
    fileName += this.datePipe.transform(this.filterForm.from_date, 'dd MMM y')+" to "+this.datePipe.transform(this.filterForm.to_date, 'dd MMM y');
    let orderList = new FieldSearchPipe().transform(this.list, 'order_number', this.search_bar);
    this.createList(orderList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }

  async createList(list) {
    let updatedList = [];
    for(let order of list) {
      let giftCardAmount = order.coupon_list.reduce((accumulator, currentValue) => { return accumulator + currentValue['price']; }, 0);
      let sendData = {};
      sendData['Date'] = this.datePipe.transform(order.created_on, 'dd MMM y hh:mm a');
      sendData['Order No.'] = order.order_number;
      sendData['Customer Name'] = order.customer_name;
      sendData['Customer Email'] = order.customer_email;
      sendData['Customer Mobile'] = order.customer_mobile;
      sendData['Address'] = order.shipping_address.address;
      sendData['City'] = order.shipping_address.city;
      sendData['State'] = order.shipping_address.state;
      sendData['Pincode'] = order.shipping_address.pincode;
      // if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1) {
      //   sendData['Delivery Time'] = 'NA';
      //   if(order.delivery_time) sendData['Delivery Time'] = this.datePipe.transform(order.delivery_time, 'dd MMM y hh:mm a');
      // }
      sendData['Shipping'] = order.shipping_cost;
      sendData['COD Charges'] = order.cod_charges;
      sendData['Gift Card'] = giftCardAmount;
      sendData['Discount'] = order.discount_amount - giftCardAmount;
      sendData['Total'] = order.final_price;
      sendData['Payment'] = 'NA';
      if(order.payment_details) sendData['Payment'] = order.payment_details.name;
      let itemsData = await this.processItemList(order.item_list);
      let newSendData = Object.assign(sendData, itemsData);
      updatedList.push(newSendData);
    }
    return updatedList;
  }

  processItemList(list) {
    return new Promise((resolve, reject) => {
      let sendData = {};
      for(let i=0; i<list.length; i++) {
        sendData['SKU'+(i+1)] = list[i].sku;
        sendData['HSN Code'+(i+1)] = 'NA';
        if(list[i].hsn_code) { sendData['HSN Code'+(i+1)] = list[i].hsn_code; }
        sendData['Item'+(i+1)] = list[i].name;
        sendData['Qty'+(i+1)] = list[i].quantity;
        if(list[i].unit) { sendData['Qty'+(i+1)] = list[i].quantity+" "+list[i].unit; }
        sendData['Price'+(i+1)] = list[i].final_price*list[i].quantity;
      }
      resolve(sendData);
    });
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem("order_page", JSON.stringify(pageData));
  }

  reqSub() {
    if(this.swPush.isEnabled) {
      this.swPush.requestSubscription({ serverPublicKey: this.commonService.vapidPublicKey })
      .then(sub => {
        sessionStorage.setItem("sw_sub","true");
        this.storeApi.STORE_UPDATE({ device_token: sub }).subscribe(result => {
          if(!result.status) console.log("response", result);
        });
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
    }
  }
  blockSub() {
    this.cookieService.set('blockSub', 'true');
  }

}
