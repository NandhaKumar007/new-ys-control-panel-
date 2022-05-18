import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../../../../services/store-api.service';
import { FeaturesApiService } from '../../../../features-api.service';
import { CommonService } from '../../../../../../../services/common.service';

@Component({
  selector: 'app-menu-sub-categories',
  templateUrl: './menu-sub-categories.component.html',
  styleUrls: ['./menu-sub-categories.component.scss'],
  animations: [SharedAnimations]
})

export class MenuSubCategoriesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  selectedMenu = JSON.parse(sessionStorage.getItem("selected_menu"));
  selectedSection = JSON.parse(sessionStorage.getItem("selected_section"));
  selectedCategory = JSON.parse(sessionStorage.getItem("selected_category"));
  menuId: string; sectionId: string; categoryId: string;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
	productList: any = [];

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private api: FeaturesApiService, private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.menuId = params.menu_id;
      this.sectionId = params.section_id;
      this.categoryId = params.category_id;
      this.api.MENU_SUBCATEGORY_LIST(this.menuId, this.sectionId, this.categoryId).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
    // product list
    this.storeApi.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
      if(result.status) this.productList = result.list;
      else console.log("response", result);
    });
  }

  // ADD
	onAdd() {
    this.addForm.menu_id = this.menuId;
    this.addForm.section_id = this.sectionId;
    this.addForm.cat_id = this.categoryId;
		this.api.ADD_MENU_SUBCATEGORY(this.addForm).subscribe(result => {
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

  // EDIT
  onEdit(x, modalName) {
    this.api.MENU_SUBCATEGORY_DETAILS({ menu_id: this.menuId, section_id: this.sectionId, cat_id: this.categoryId, _id: x._id }).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
    this.editForm.menu_id = this.menuId;
    this.editForm.section_id = this.sectionId;
    this.editForm.cat_id = this.categoryId;
		this.api.UPDATE_MENU_SUBCATEGORY(this.editForm).subscribe(result => {
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
    this.deleteForm.menu_id = this.menuId;
    this.deleteForm.section_id = this.sectionId;
    this.deleteForm.cat_id = this.categoryId;
    this.api.DELETE_MENU_SUBCATEGORY(this.deleteForm).subscribe(result => {
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