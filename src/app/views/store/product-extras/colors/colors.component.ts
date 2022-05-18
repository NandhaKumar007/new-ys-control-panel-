import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  animations: [SharedAnimations]
})

export class ColorsComponent implements OnInit {

  page = 1; pageSize = 10; list: any = [];
  colorForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  state_list: any = [];

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.COLOR_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    if(this.colorForm.form_type=='add') {
      this.api.ADD_COLOR(this.colorForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.colorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_COLOR(this.colorForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.colorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.colorForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.colorForm[key] = x[key];
    }
    this.modalService.open(modalName);
  }

  // DELETE
  onDelete() {
    this.api.DELETE_COLOR(this.deleteForm).subscribe(result => {
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
