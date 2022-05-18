import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-abandoned-customers',
  templateUrl: './abandoned-customers.component.html',
  styleUrls: ['./abandoned-customers.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedCustomersComponent implements OnInit {

  page = 1; pageSize = 10;
  filterForm: any = { search: "" }; totalPages: number = 0;
  pagesList: any = []; list: any = [];
  pageLoader: boolean; exportLoader: boolean;

  constructor(
    private customerApi: CustomerApiService, public router: Router, public commonService: CommonService,
    private excelService: ExcelService, private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.page = 1;
    if(this.commonService.page_attr && this.commonService.page_attr.type=='abandoned_customer') {
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
    this.customerApi.ABANDONED_CARTS(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(element => {
          element.city = "NA";
          if(element.address_list.length) {
            let filteredAddress = [element.address_list[0]];
            let billingIndex = element.address_list.findIndex(obj => obj.billing_address);
            if(billingIndex!=-1) filteredAddress = [element.address_list[billingIndex]];
            element.mobile = filteredAddress[0].mobile;
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(filteredAddress[0].dial_code) element.mobile = filteredAddress[0].dial_code+" "+element.mobile;
            element.city = filteredAddress[0].city;
          }
          else if(!element.mobile) element.mobile = "NA";
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
      type: 'abandoned_customer', page: this.page, search: this.filterForm.search,
      scroll_pos: this.commonService.scroll_y_pos
    };
  }

  exportAsXLSX() {
    this.exportLoader = true;
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, 'customer-abandoned-cart'+' export '+new Date().getTime());
      setTimeout(() => { this.exportLoader = false; }, 500);
    })
  }
  async createList(productList) {
    let updatedList = [];
    for(let prod of productList) {
      let sendData = {};
      sendData['Name'] = prod.name;
      sendData['Email ID'] = prod.email;
      sendData['Phone Number'] = prod.mobile;
      sendData['Date'] = this.datePipe.transform(prod.cart_updated_on, 'dd MMM y hh:mm a');
      sendData['City'] = prod.city;
      updatedList.push(sendData);
    }
    return updatedList;
  }

}