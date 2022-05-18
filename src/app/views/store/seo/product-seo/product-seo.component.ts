import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-product-seo',
  templateUrl: './product-seo.component.html',
  styleUrls: ['./product-seo.component.scss'],
  animations: [SharedAnimations]
})

export class ProductSeoComponent implements OnInit {

  pageLoader: boolean;
  list: any = []; seoForm: any = {};
	page = 1; pageSize = 10; search_bar: string;
  category_id: any = 'all'; product_details: any;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.onChangeCategory(this.category_id);
  }

  onChangeCategory(x) {
    this.pageLoader = true; this.search_bar = null;
    this.api.PRODUCT_LIST({ category_id: x }).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onEdit(x, modalName) {
    this.api.PRODUCT_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.product_details = result.data;
        this.seoForm = result.data.seo_details;
        this.seoForm.meta_keyword_list = [];
        if(this.seoForm.meta_keywords.length) {
          this.seoForm.meta_keywords.forEach(obj => {
            this.seoForm.meta_keyword_list.push({display: obj, value: obj});
          });
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdate() {
    this.seoForm.modified = true;
    let productUrl = this.commonService.urlFormat(this.product_details.name+' '+this.product_details.sku);
    if(this.seoForm.default_setting && productUrl) {
      this.seoForm.modified = false;
      this.seoForm.page_url = productUrl;
      this.seoForm.h1_tag = this.product_details.name.substring(0, 70);
      this.seoForm.page_title = this.product_details.name.substring(0, 70);
      this.seoForm.meta_desc = this.commonService.stripHtml(this.seoForm.description).substring(0, 320);
    }
    this.seoForm.meta_keywords = [];
    if(this.seoForm.meta_keyword_list) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        this.seoForm.meta_keywords.push(obj.value);
      });
    }
    let formData = { _id: this.product_details._id, seo_status: true, seo_details: this.seoForm };
    this.api.UPDATE_PRODUCT_DETAILS(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}