import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-quick-orders',
  templateUrl: './quick-orders.component.html',
  styleUrls: ['./quick-orders.component.scss'],
  animations: [SharedAnimations]
})

export class QuickOrdersComponent implements OnInit {

  page = 1; pageSize = 10;
  parentList: any = []; list: any = [];
  search_bar: any; list_type: string = 'all';
  deleteForm: any; pageLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.QUICK_ORDER_LIST().subscribe(result => {
      if(result.status) {
        this.parentList = result.list;
        this.parentList.forEach(obj => {
          obj.item_names = [];
          obj.item_list.forEach(prod => {
            if(obj.item_names.indexOf(prod.name)==-1) obj.item_names.push(prod.name);
          });
          obj.expired = false;
          if(obj.expiry_status && obj.expiry_on) {
            if(new Date() > new Date(obj.expiry_on)) obj.expired = true;
          }
        });
        this.onTypeChange(this.list_type);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onTypeChange(x) {
    if(x=='active') this.list = this.parentList.filter(obj => obj.status==x && !obj.expired);
    else if(x=='inactive') this.list = this.parentList.filter(obj => obj.status==x || obj.expired);
    else this.list = this.parentList;
  }

  onDelete() {
    this.api.DELETE_QUICK_ORDER(this.deleteForm).subscribe(result => {
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

  onUpdateStatus() {
    let status = "active";
    if(this.deleteForm.status=='active') status = "inactive";
    let formData = { _id: this.deleteForm._id, status: status };
    this.api.UPDATE_QUICK_ORDER(formData).subscribe(result => {
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

  copyText(id, index) {
    let val = this.commonService.store_details.base_url+'/checkout/quick-order/'+id;
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.list[index].copied= true;
    setTimeout(() =>{ this.list[index].copied= false; }, 1000);
  }

  socialShare(id) {
    let windowNav: any = window.navigator;
    if(windowNav && windowNav.share) {
      windowNav.share({
        title: '', text: '',
        url: this.commonService.store_details.base_url+'/checkout/quick-order/'+id
      })
      .catch( (error) => { console.log(error); });
    }
    else console.log("share not supported");
  }

}