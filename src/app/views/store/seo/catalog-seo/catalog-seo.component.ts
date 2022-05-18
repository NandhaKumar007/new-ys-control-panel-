import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-catalog-seo',
  templateUrl: './catalog-seo.component.html',
  styleUrls: ['./catalog-seo.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogSeoComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  seoForm: any = {}; pageLoader: boolean;
  catalog_details: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.storeApi.CATALOG_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.catalog_list = result.list;
        this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.storeApi.CATALOG_DETAILS({ _id: x._id }).subscribe(result => {
      if(result.status) {
        this.catalog_details = result.data;
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

  // UPDATE
	onUpdate() {
    this.seoForm.modified = true;
    if(this.seoForm.default_setting) this.seoForm.modified = false;
    this.seoForm.meta_keywords = [];
    if(this.seoForm.meta_keyword_list.length) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        this.seoForm.meta_keywords.push(obj.value);
      });
    }
    let formData: any = { _id: this.catalog_details._id, seo_status: true, seo_details: this.seoForm };
    if(!this.seoForm.modified) formData.name = this.catalog_details.name;
    this.storeApi.UPDATE_CATALOG(formData).subscribe(result => {
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
