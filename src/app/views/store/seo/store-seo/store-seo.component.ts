import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-store-seo',
  templateUrl: './store-seo.component.html',
  styleUrls: ['./store-seo.component.scss'],
  animations: [SharedAnimations]
})

export class StoreSeoComponent implements OnInit {

  seoForm: any = {};
  pageLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
  }

  onEdit(modalName) {
    this.api.STORE_DETAILS().subscribe(result => {
      if(result.status) {
        let storeDetails = result.data;
        if(storeDetails.seo_details) {
          this.seoForm = storeDetails.seo_details;
          this.seoForm.meta_keyword_list = [];
          if(this.seoForm.meta_keywords.length) {
            this.seoForm.meta_keywords.forEach(obj => {
              this.seoForm.meta_keyword_list.push({display: obj, value: obj});
            });
          }
        }
        this.modalService.open(modalName, { size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdate() {
    let seoDetails = {
      tile_color: this.seoForm.tile_color,
      h1_tag: this.seoForm.h1_tag,
      page_title: this.seoForm.page_title,
      meta_desc: this.seoForm.meta_desc,
      meta_keywords: []
    };
    if(this.seoForm.meta_keyword_list) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        seoDetails.meta_keywords.push(obj.value);
      });
    }
    this.api.STORE_UPDATE({ seo_details: seoDetails }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
				this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}