import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.scss'],
  animations: [SharedAnimations]
})

export class TaxRatesComponent implements OnInit {

  page = 1; pageSize = 10; list: any = [];
  taxForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  state_list: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService,
    public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.TAX_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    // state list
    let index = this.commonService.country_list.findIndex(obj => obj.name==this.commonService.store_details.country);
    if(index!=-1) this.state_list = this.commonService.country_list[index].states;
  }

  onAddModal(modalName) {
    this.taxForm = { formType: 'add' };
    if(!this.list.length) this.taxForm.primary = true;
    if(this.commonService.store_details?.country=='India') this.taxForm.home_country = 'India';
    if(this.taxForm.home_country=='India') this.taxForm.home_state = this.commonService.store_details?.company_details?.state;
    this.modalService.open(modalName, { size: 'lg'});
  }

  onEdit(x, modalName) {
    this.api.TAX_LIST().subscribe(result => {
			if(result.status) {
        let taxList = result.list;
        let index = taxList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.taxForm = taxList[index];
          this.taxForm.formType = 'edit';
          this.taxForm.prev_primary = taxList[index].primary;
          this.modalService.open(modalName, {size: "lg"});
        }
        else console.log("invalid foot note");
      }
      else console.log("response", result);
		});
  }

  onSubmit() {
    if(this.taxForm.formType=='add') {
      this.api.ADD_TAX(this.taxForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.taxForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_TAX(this.taxForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.taxForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onDelete() {
    this.api.DELETE_TAX(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
				this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}