import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-catalog-layout',
  templateUrl: './catalog-layout.component.html',
  styleUrls: ['./catalog-layout.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogLayoutComponent implements OnInit {

  page = 1; pageSize = 10; btnLoader: boolean;
  search_bar: string; bannerForm: any = {};
  modalTitle: string; modalType: string;
  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, private sidebar: SidebarService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    setTimeout(() => { this.pageLoader = false; }, 500);
  }

  // EDIT SECTION
  onEditSection(x, modalName) {
    this.btnLoader = false;
    this.api.CATALOG_DETAILS({ _id: x._id }).subscribe(result => {
      if(result.status) {
        this.bannerForm = result.data;
        this.bannerForm.exist_image = result.data.image;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
    this.btnLoader = true;
    this.bannerForm.prev_rank = this.bannerForm.rank;
    this.api.UPDATE_CATALOG(this.bannerForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.sidebar.BUILD_CATEGORY_LIST();
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.bannerForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.bannerForm.image = (<FileReader>event.target).result;
        this.bannerForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}