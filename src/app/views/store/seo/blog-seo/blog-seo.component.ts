import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../../features/features-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-blog-seo',
  templateUrl: './blog-seo.component.html',
  styleUrls: ['./blog-seo.component.scss'],
  animations: [SharedAnimations]
})

export class BlogSeoComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  seoForm: any = {}; pageLoader: boolean;
  blog_details: any;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private featureApi: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.featureApi.BLOG_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.featureApi.BLOG_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.blog_details = result.data;
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
    let blogUrl = this.commonService.urlFormat(this.blog_details.name);
    if(this.seoForm.default_setting && blogUrl) {
      this.seoForm.modified = false;
      this.seoForm.page_url = blogUrl;
      this.seoForm.h1_tag = this.blog_details.name.substring(0, 70);
      this.seoForm.page_title = this.blog_details.name.substring(0, 70);
      this.seoForm.meta_desc = this.commonService.stripHtml(this.seoForm.description).substring(0, 320);
    }
    this.seoForm.meta_keywords = [];
    if(this.seoForm.meta_keyword_list) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        this.seoForm.meta_keywords.push(obj.value);
      });
    }
    let formData = { _id: this.blog_details._id, seo_status: true, seo_details: this.seoForm };
    this.featureApi.UPDATE_BLOG(formData).subscribe(result => {
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
