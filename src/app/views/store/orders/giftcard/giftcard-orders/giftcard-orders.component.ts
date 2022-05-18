import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';
import { ExcelService } from '../../../../../services/excel.service';
import { GridSearchPipe } from '../../../../../shared/pipes/grid-search.pipe';

@Component({
  selector: 'app-giftcard-orders',
  templateUrl: './giftcard-orders.component.html',
  styleUrls: ['./giftcard-orders.component.scss'],
  animations: [SharedAnimations]
})

export class GiftcardOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string; exportLoader: boolean;
  page = 1; pageSize = 10;
  params: any = {}; filterForm: any = {};
  parentList: any = []; list: any = []; addForm: any = {};
  list_type: string = 'all';
  deleteForm: any = {}; btnLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: OrderService, private activeRoute: ActivatedRoute,
    private excelService: ExcelService, private datePipe: DatePipe, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.pageLoader = true;
      this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
      this.getCouponList();
    });
  }

  getCouponList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.api.COUPON_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          this.parentList = result.list;
          this.onTypeChange(this.list_type);
        }
        else console.log("response", result);
      });
    }
  }

  onTypeChange(x) {
    this.pageLoader = true;
    let couponList = this.parentList;
    if(x=="deactivated") this.list = couponList.filter(obj => obj.status=='deactivated');
    else if(x=="active") this.list = couponList.filter(obj => obj.status=='active' && obj.balance>0 && new Date(obj.expiry_on)>new Date());
    else if(x=="used") this.list = couponList.filter(obj => obj.status=='active' && obj.balance<=0 && new Date(obj.expiry_on)>new Date());
    else if(x=="expired") this.list = couponList.filter(obj => obj.status=='active' && new Date(obj.expiry_on)<new Date());
    else this.list = couponList;
    this.list.forEach(obj => {
      if(obj.customerDetails.length) {
        obj.customer_name = obj.customerDetails[0].name;
        obj.customer_email = obj.customerDetails[0].email;
        obj.customer_mobile = obj.customerDetails[0].mobile;
      }
    });
    setTimeout(() => { this.pageLoader = false; }, 500);
  }

  // add
  onAdd() {
    this.btnLoader = true;
    this.addForm.order_by = "admin";
    this.addForm.status = "active";
    this.addForm.payment_success = true;
    this.addForm.coupon_type = this.commonService.store_details.additional_features.giftcard_type;
    this.addForm.gc_validity_in_month = this.commonService.store_details.additional_features.gc_validity_in_month;
    this.api.CREATE_COUPON(this.addForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCouponList();
      }
      else {
        this.addForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.api.DELETE_COUPON({ _id: this.deleteForm._id }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCouponList();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  checkValid(expiryDate) {
    if(new Date(expiryDate) > new Date()) return true;
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "Gift Card Orders from "+this.datePipe.transform(this.filterForm.from_date, 'dd MMM y')+" to "+this.datePipe.transform(this.filterForm.to_date, 'dd MMM y');
    let productList = new GridSearchPipe().transform(this.list, { order_number: this.search_bar, code: this.search_bar, to_email: this.search_bar });
    this.createList(productList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    })
  }

  createList(list) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let order of list) {
        let sendData = {};
        sendData['Date'] = this.datePipe.transform(order.created_on, 'dd MMM y hh:mm a');
        sendData['Order No.'] = order.order_number;
        sendData['Customer Name'] = this.commonService.store_details.name; sendData['Customer Email'] = "NA"; sendData['Customer Mobile'] = "NA";
        sendData['Address'] = "NA"; sendData['State'] = "NA"; sendData['Pincode'] = "NA";
        let payment = "NA";
        if(order.order_by=='user') {
          sendData['Customer Name'] = order.customerDetails[0].name;
          sendData['Customer Email'] = order.customerDetails[0].email;
          if(order.customerDetails[0].mobile) { sendData['Customer Mobile'] = order.customerDetails[0].mobile; }
          else { sendData['Customer Mobile'] = "NA"; }
          if(Object.entries(order.billing_address).length) {
            sendData['Address'] = order.billing_address.address;
            sendData['State'] = order.billing_address.state;
            sendData['Pincode'] = order.billing_address.pincode;
          }
          if(order.payment_details) payment = order.payment_details.name;
        }
        sendData['Price'] = order.price;
        sendData['Payment'] = payment;
        updatedList.push(sendData);
      }
      resolve(updatedList);
    });
  }

}