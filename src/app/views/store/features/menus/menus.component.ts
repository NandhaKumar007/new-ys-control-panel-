import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  animations: [SharedAnimations]
})

export class MenusComponent implements OnInit {

	page = 1; pageSize = 5; formType: string;
	list: any = []; maxRank: any = 0; menuId: string;
	addForm: any; editForm: any; deleteForm: any; imgForm: any;
	pageLoader: boolean; search_bar: string;
	productList: any = [];
	imgBaseUrl = environment.img_baseurl;

	constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: FeaturesApiService,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

	ngOnInit() {
		this.pageLoader = true;
		this.api.MENU_LIST().subscribe(result => {
			if(result.status) this.list = result.list;
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
		});
    // product list
    this.storeApi.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
      if(result.status) this.productList = result.list;
      else console.log("response", result);
    });
	}

  // ADD
  openAddMenuModal(modalName) {
    if(this.commonService.ys_features.indexOf('multi_menu')!=-1 || this.list.length<2) {
      this.maxRank = this.list.length;
      this.formType = 'menu';
      this.addForm = { rank: this.list.length+1 };
      this.modalService.open(modalName);
    }
    else {
      document.getElementById("openCommonUpgradeModal").click();
    }
  }
  openAddSectionModal(modalName, x) {
    if(this.commonService.ys_features.indexOf('multi_menu')!=-1 || x.sections?.length<4) {
      this.maxRank = x.sections.length;
      this.formType = 'section';
      this.menuId = x._id;
      this.addForm = { rank: x.sections.length+1 };
      this.modalService.open(modalName);
    }
    else {
      document.getElementById("openCommonUpgradeModal").click();
    }
  }
	onAdd() {
		if(this.formType=='menu') {
			this.api.ADD_MENU(this.addForm).subscribe(result => {
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
		else if(this.formType=='section') {
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
		else console.log("Invalid form");
	}

	// EDIT
  onEdit(x, modalName) {
		if(this.formType=='menu') {
      this.api.MENU_DETAILS({ _id: x._id }).subscribe(result => {
				if(result.status) {
					this.editForm = result.data;
          this.editForm.prev_rank = this.editForm.rank;
          delete this.editForm.sections;
          delete this.editForm.menu_images;
          this.modalService.open(modalName);
				}
				else console.log("response", result);
			});
		}
		else if(this.formType=='section') {
			this.api.MENU_SECTION_DETAILS({ menu_id: this.menuId, _id: x._id }).subscribe(result => {
				if(result.status) {
					this.editForm = result.data;
          this.editForm.prev_rank = this.editForm.rank;
          this.modalService.open(modalName);
				}
				else console.log("response", result);
			});
		}
		else console.log("Invalid form");
  }

  // UPDATE
	onUpdate() {
    if(this.formType=='menu') {
			this.api.UPDATE_MENU(this.editForm).subscribe(result => {
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
		else if(this.formType=='section') {
			this.editForm.menu_id = this.menuId;
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
		else console.log("Invalid form");
  }
  
  // DELETE
  onDelete() {
		if(this.formType=='menu') {
			this.api.DELETE_MENU(this.deleteForm).subscribe(result => {
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
		else if(this.formType=='section') {
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
		else console.log("Invalid form");
  }

	// View Categories
	onViewCategories(x, y) {
		this.menuId = x._id;
		sessionStorage.setItem("selected_menu", JSON.stringify({name: x.name}));
		sessionStorage.setItem("selected_section", JSON.stringify({_id: this.menuId, name: y.name}));
		this.router.navigate(["features/menus/"+this.menuId+'/'+y._id]);
  }

  openMenuImgModal(x, modalName) {
    if(x.menu_images && x.menu_images.length) this.imgForm = { _id: x._id, name: x.name, menu_images: x.menu_images };
    else this.imgForm = { _id: x._id, name: x.name, menu_images: [{}] };
    this.modalService.open(modalName, { windowClass:'xlModal' });
	}
	
	onUpdateImages() {
		this.imgForm.submit = true;
		this.api.UPDATE_MENU_IMAGES(this.imgForm).subscribe(result => {
			this.imgForm.submit = false;
			if(result.status) {
				document.getElementById('closeModal').click();
				this.ngOnInit();
			}
			else {
				this.imgForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
	}
  
  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.imgForm.menu_images[index].image = (<FileReader>event.target).result;
        this.imgForm.menu_images[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}