import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  animations: [SharedAnimations]
})

export class CollectionsComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
  pageLoader: boolean; search_bar: string;
  deleteForm: any;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: FeaturesApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(this.commonService.page_attr?.type=='collections') {
      let pageInfo = this.commonService.page_attr;
      this.page = pageInfo.page;
      delete this.commonService.page_attr;
    }
    this.pageLoader = true;
    this.api.COLLECTION_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_COLLECTION(this.deleteForm).subscribe(result => {
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

  goModifyPage(x) {
    this.commonService.page_attr = { type: 'collections', page: this.page, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/features/collections/modify/"+x._id+"/"+this.maxRank]);
  }

}