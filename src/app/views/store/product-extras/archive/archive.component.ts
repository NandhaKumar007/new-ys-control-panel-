import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  animations: [SharedAnimations]
})
export class ArchiveComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  btnLoader: boolean;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.ARCHIVE_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
        this.commonService.archive_list = this.list;
        this.commonService.updateLocalData('archive_list', this.list);
        this.list.forEach(element => {
          element.product_count = element.archive_products.filter(obj => obj.archive_status && obj.status=="active").length;
        });
        // get max rank
				if(result.list.length) {
					let sortList = result.list.sort((a, b) => 0 - (a.rank > b.rank ? 1 : -1));
					this.maxRank = sortList[0].rank;
				}
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // ADD
  onAdd() {
    this.api.ADD_ARCHIVE(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.ngOnInit();
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }
  
  // UPDATE
  onUpdate() {
		this.api.UPDATE_ARCHIVE(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_ARCHIVE(this.deleteForm).subscribe(result => {
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

  onUnarchiveProducts() {
    this.btnLoader = true;
    this.api.MOVE_BULK_PRODUCTS_FROM_ARCHIVE({ archive_id: this.deleteForm._id }).subscribe(result => {
      this.btnLoader = false;
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

}