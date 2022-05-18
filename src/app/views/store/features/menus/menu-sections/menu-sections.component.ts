import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../../services/store-api.service';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-menu-sections',
  templateUrl: './menu-sections.component.html',
  styleUrls: ['./menu-sections.component.scss'],
  animations: [SharedAnimations]
})

export class MenuSectionsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  selectedMenu = JSON.parse(sessionStorage.getItem("selected_menu"));
  menuId: string; search_bar: string; pageLoader: boolean;
  addForm: any; editForm: any; deleteForm: any;
	productList: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.menuId = params.menu_id;
      this.api.MENU_SECTION_LIST(this.menuId).subscribe(result => {
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
		this.api.ADD_MENU_SECTION(this.addForm).subscribe(result => {
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
    this.api.MENU_SECTION_DETAILS({ menu_id: this.menuId, _id: x._id }).subscribe(result => {
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
    if(this.editForm.seo_status && this.editForm.update_seo) this.editForm.seo_details.modified = false;
		this.api.UPDATE_MENU_SECTION(this.editForm).subscribe(result => {
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
    this.api.DELETE_MENU_SECTION(this.deleteForm).subscribe(result => {
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

  // Route Change
	onRouterChange(x) {
		sessionStorage.setItem("selected_section", JSON.stringify({_id: this.menuId, name: x.name}));
		this.router.navigate(["features/menus/"+this.menuId+'/'+x._id]);
  }

}
