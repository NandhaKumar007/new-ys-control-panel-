import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
  animations: [SharedAnimations]
})

export class BranchesComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  locForm: any; deleteForm: any;
  list: any = []; state_list: any = [];
  pageLoader: boolean; maxRank: number = 0;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.BRANCH_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // Add
  onSubmit() {
    if(this.locForm.form_type=='add') {
      this.api.ADD_BRANCH(this.locForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.locForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_BRANCH(this.locForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.locForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onUpdateStatus() {
    let formData: any = {};
    for(let key in this.locForm) {
      if(this.locForm.hasOwnProperty(key)) formData[key] = this.locForm[key];
    }
    formData.status = this.locForm.new_status;
    this.api.UPDATE_BRANCH(formData).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
      }
			else {
				this.locForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // Edit
  onEdit(x, modal) {
    this.locForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.locForm[key] = x[key];
    }
    this.modalService.open(modal);
  }

  // Delete
  onDelete() {
    this.api.DELETE_BRANCH(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) this.state_list = this.commonService.country_list[index].states;
  }

}