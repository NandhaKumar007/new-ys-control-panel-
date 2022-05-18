import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-discounts-page',
  templateUrl: './discounts-page.component.html',
  styleUrls: ['./discounts-page.component.scss'],
  animations: [SharedAnimations]
})

export class DiscountsPageComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; pageLoader: boolean;
  addForm: any; editForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  maxRank: any = 0; search_bar: string;
  productList: any = []; settingForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.DISCOUNTS_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    // product list
    this.storeApi.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
      if(result.status) this.productList = result.list;
      else console.log("response", result);
    });
  }

  // ADD
  onAdd() {
    this.addForm.btnLoader = true;
    this.api.ADD_DISCOUNT(this.addForm).subscribe(result => {
      this.addForm.btnLoader = false;
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.editForm = {
      _id: x._id, name: x.name, rank: x.rank, image: x.image, heading: x.heading,
      sub_heading: x.sub_heading, link_type: x.link_type, category_id: x.category_id,
      product_id: x.product_id, link: x.link, btn_status: x.btn_status,
      btn_text: x.btn_text, created_on: x.created_on
    };
    this.editForm.prev_rank = this.editForm.rank;
    this.modalService.open(modalName, {size: 'lg'});
  }

  // UPDATE
  onUpdate() {
    this.editForm.btnLoader = true;
    this.api.UPDATE_DISCOUNT(this.editForm).subscribe(result => {
      this.editForm.btnLoader = false;
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
			else {
				this.editForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_DISCOUNT(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // PAGE SETTING
  onUpdateSetting() {
    this.api.UPDATE_DISCOUNT_CONFIG({ "page_config": this.settingForm }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(type=='add') {
          this.addForm.image = (<FileReader>event.target).result;
          this.addForm.img_change = true;
        }
        else {
          this.editForm.image = (<FileReader>event.target).result;
          this.editForm.img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
