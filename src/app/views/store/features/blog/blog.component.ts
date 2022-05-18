import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: [SharedAnimations]
})
export class BlogComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  blogForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  currentDate: Date = new Date();
  seoForm: any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.BLOG_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

	onSubmit(modalName) {
    this.blogForm.submit = true;
    let blogUrl = this.commonService.urlFormat(this.blogForm.name);
    if(this.blogForm.form_type=='add') {
      if(blogUrl) {
        this.blogForm.seo_status = true;
        this.blogForm.seo_details = {
          page_url: blogUrl,
          h1_tag: this.blogForm.name.substring(0, 70),
          page_title: this.blogForm.name.substring(0, 70),
          meta_desc: this.commonService.stripHtml(this.blogForm.description).substring(0, 320)
        };
      }
      this.api.ADD_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      if(!this.blogForm.seo_details) this.blogForm.seo_details = {};
      if(this.blogForm.update_seo) this.blogForm.seo_details.modified = false;
      if(blogUrl && !this.blogForm.seo_details.modified) {
        this.blogForm.seo_status = true;
        this.blogForm.seo_details.page_url = blogUrl;
        this.blogForm.seo_details.h1_tag = this.blogForm.name.substring(0, 70);
        this.blogForm.seo_details.page_title = this.blogForm.name.substring(0, 70);
        this.blogForm.seo_details.meta_desc = this.commonService.stripHtml(this.blogForm.description).substring(0, 320);
      }
      this.api.UPDATE_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.blogForm = { form_type: 'edit', step_num: 1 };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.blogForm[key] = x[key];
    }
    this.blogForm.exist_image = this.blogForm.image;
    this.blogForm.created_on = new Date(this.blogForm.created_on);
    this.modalService.open(modalName, {size: "lg"});
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.blogForm = x;
    this.blogForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.api.UPDATE_BLOG({ _id: this.blogForm._id, status: this.blogForm.change_status+"d" }).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
			else {
				this.blogForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_BLOG(this.deleteForm).subscribe(result => {
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

  // SEO update
  openSettingModal(modalName) {
    this.seoForm = {};
    this.storeApi.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        if(result.data.blog_seo) {
          this.seoForm = result.data.blog_seo;
          this.seoForm.meta_keyword_list = [];
          if(this.seoForm.meta_keywords.length) {
            this.seoForm.meta_keywords.forEach(obj => {
              this.seoForm.meta_keyword_list.push({display: obj, value: obj});
            });
          }
        }
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }
  onUpdateSetting() {
    if(this.seoForm.status) {
      this.seoForm.meta_keywords = [];
      if(this.seoForm.meta_keyword_list) {
        this.seoForm.meta_keyword_list.forEach(obj => {
          this.seoForm.meta_keywords.push(obj.value);
        });
      }
    }
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ blog_seo: this.seoForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.blogForm.image = (<FileReader>event.target).result;
        this.blogForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}