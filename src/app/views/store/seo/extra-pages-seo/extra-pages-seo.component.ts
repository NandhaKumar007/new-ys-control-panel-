import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { SetupService } from '../../setup/setup.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-extra-pages-seo',
  templateUrl: './extra-pages-seo.component.html',
  styleUrls: ['./extra-pages-seo.component.scss'],
  animations: [SharedAnimations]
})
export class ExtraPagesSeoComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  pageDetails: any = {}; pageLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private api: SetupService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.EXTRA_PAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.list = result.list;
      else console.log("response", result);
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.api.EXTRA_PAGE_DETAILS(x._id).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.pageDetails = result.data;
        this.pageDetails.seo_details.meta_keyword_list = [];
        if(this.pageDetails.seo_details.meta_keywords.length) {
          this.pageDetails.seo_details.meta_keywords.forEach(obj => {
            this.pageDetails.seo_details.meta_keyword_list.push({display: obj, value: obj});
          });
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
    this.pageDetails.seo_details.meta_keywords = [];
    if(this.pageDetails.seo_details.meta_keyword_list.length) {
      this.pageDetails.seo_details.meta_keyword_list.forEach(obj => {
        this.pageDetails.seo_details.meta_keywords.push(obj.value);
      });
    }
    let formData = { _id: this.pageDetails._id, seo_status: this.pageDetails.seo_status, seo_details: this.pageDetails.seo_details };
    this.api.UPDATE_EXTRA_PAGE(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.pageDetails.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}