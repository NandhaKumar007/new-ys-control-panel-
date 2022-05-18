import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { QuotationService } from './quotation.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { FieldSearchPipe } from '../../../shared/pipes/field-search.pipe';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss'],
  animations: [SharedAnimations]
})

export class QuotationsComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; exportLoader: boolean;
  params: any = {}; filterForm: any = {};
  list: any = []; scrollPos: number = 0;

  constructor(private api: QuotationService, private activeRoute: ActivatedRoute, private excelService: ExcelService, private datePipe: DatePipe, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.page = 1; this.pageSize = 10;
      this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
      this.filterForm.type = this.params.type;
      if(this.params.type=='live') this.filterForm.type = 'all';
      this.filterForm.customer_id = this.params.customer_id;
      if(this.commonService.page_attr) {
        let pageInfo = this.commonService.page_attr;
        delete this.commonService.page_attr;
        this.scrollPos = pageInfo.scroll_pos;
        this.page = pageInfo.page_no;
        this.search_bar = pageInfo.search;
        if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
        if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      }
      this.getQuotationList();
    });
  }

  getQuotationList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      if(this.filterForm.type!='completed' && this.filterForm.type!='cancelled') this.filterForm.date_type = 'modified_on';
      else if(this.filterForm.type=='completed') this.filterForm.date_type = 'completed_on';
      else if(this.filterForm.type=='cancelled') this.filterForm.date_type = 'cancelled_on';
      this.api.QUOTATION_LIST(this.filterForm).subscribe(result => {
        if(result.status) {
          if(this.filterForm.type!='completed' && this.filterForm.type!='cancelled') this.list = result.list.sort((a, b) => 0 - (a.modified_on > b.modified_on ? 1 : -1));
          else if(this.filterForm.type=='completed') this.list = result.list.sort((a, b) => 0 - (a.completed_on > b.completed_on ? 1 : -1));
          else if(this.filterForm.type=='cancelled') this.list = result.list.sort((a, b) => 0 - (a.cancelled_on > b.cancelled_on ? 1 : -1));
          this.list.forEach(obj => {
            obj.customer_name = obj.customerDetails[0].name;
            obj.customer_email = obj.customerDetails[0].email;
            obj.customer_mobile = 'NA';
            if(obj.customerDetails[0].mobile) { obj.customer_mobile = obj.customerDetails[0].mobile; }
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
      });
    }
  }

  exportAsXLSX() {
    // this.exportLoader = true;
    // let fileName = "";
    // if(this.params.type=='live') fileName += "Live Quotations from ";
    // else if(this.params.type=='completed') fileName += "Completed Quotations from ";
    // else if(this.params.type=='cancelled') fileName += "cancelled Quotations from ";
    // fileName += this.datePipe.transform(this.filterForm.from_date, 'dd MMM y')+" to "+this.datePipe.transform(this.filterForm.to_date, 'dd MMM y');
    // let orderList = new FieldSearchPipe().transform(this.list, 'order_number', this.search_bar);
    // this.createList(orderList).then((exportList: any[]) => {
    //   this.excelService.exportAsExcelFile(exportList, fileName);
    //   setTimeout(() => { this.exportLoader = false; }, 500);
    // });
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
      sendData['State'] = order.shipping_address.state;
      sendData['Pincode'] = order.shipping_address.pincode;
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
        if(list[i].hsn_code) sendData['HSN Code'+(i+1)] = list[i].hsn_code;
        sendData['Item'+(i+1)] = list[i].name;
        sendData['Qty'+(i+1)] = list[i].quantity;
        if(list[i].unit) { sendData['Qty'+(i+1)] = list[i].quantity+" "+list[i].unit; }
        sendData['Price'+(i+1)] = list[i].final_price*list[i].quantity;
      }
      resolve(sendData);
    });
  }

  capturePageData() {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
  }

}