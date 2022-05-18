import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-packages',
  templateUrl: './ys-packages.component.html',
  styleUrls: ['./ys-packages.component.scss'],
  animations: [SharedAnimations]
})

export class YsPackagesComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];
  packageForm: any; deleteForm: any;
  formType: string; search_bar: string;
  currency_list: any = this.commonService.currency_types.filter(obj => obj.store_base);
  featuresList: any = this.commonService.admin_features;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.adminApi.PACKAGE_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.admin_packages = this.list;
        this.commonService.updateLocalData('admin_packages', this.commonService.admin_packages);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAddModal(modalName) {
    this.formType = 'add';
    this.packageForm = {};
    this.modalService.open(modalName, { windowClass:'xlModal' });
    this.currency_list.forEach(element => {
      delete element.live;
      delete element.amount;
      delete element.selling_amount;
      delete element.transaction_fees;
      delete element.transaction_limit;
    });
  }

  onSubmit() {
    let currencyTypes: any = {};
    this.currency_list.forEach(element => {
      currencyTypes[element.base] = {
        live: parseFloat(element.live), amount: parseFloat(element.amount), selling_amount: parseFloat(element.selling_amount),
        transaction_fees: parseFloat(element.transaction_fees), transaction_limit: parseFloat(element.transaction_limit)
      };
    });
    this.packageForm.currency_types = currencyTypes;
    if(this.formType=='add') {
      // add
      this.adminApi.ADD_PACKAGE(this.packageForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      // update
      this.adminApi.UPDATE_PACKAGE(this.packageForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onEdit(x, modalName) {
    this.formType = 'edit'; this.packageForm = {};
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.packageForm[key] = x[key];
    }
    delete this.packageForm.currency_types;
    this.currency_list.forEach(element => {
      element.live = x.currency_types[element.base].live;
      element.amount = x.currency_types[element.base].amount;
      element.selling_amount = x.currency_types[element.base].selling_amount;
      element.transaction_fees = x.currency_types[element.base].transaction_fees;
      element.transaction_limit = x.currency_types[element.base].transaction_limit;
    });
    this.modalService.open(modalName, { windowClass:'xlModal' });
  }

  // DELETE
  onDelete() {
    this.adminApi.DELETE_PACKAGE(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}