import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  animations: [SharedAnimations]
})

export class HomeLayoutComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; search_bar: string;
  list: any = []; maxRank: any = 0;
  addForm: any; editForm: any; deleteForm: any;
  layoutTypes: any = [
    { name: "Primary Slider", value: "primary_slider" },
    { name: "Main Slider", value: "slider" },
    { name: "Section Grid", value: "section" },
    { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Highlighted Section", value: "highlighted_section" },
    { name: "Multi-Highlighted Section", value: "multiple_highlighted_section" },
    { name: "Multi-tab Featured Products", value: "multiple_featured_product" },
    { name: "Secondary Banner", value: "secondary" },
    { name: "Flexible Segment", value: "flexible" }
  ];
  multiTabOptions: any = [
    { type: "featured", disp_name: "Featured" },
    { type: "new_arrivals", disp_name: "New Arrivals" },
    { type: "discounted", disp_name: "Discounted" },
    { type: "category", disp_name: "Catalog" }
  ];
  themeColorExists: boolean; configData: any = environment.config_data;

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal,
    private api: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(this.commonService.deploy_details.theme_colors && this.commonService.deploy_details.theme_colors.primary) this.themeColorExists = true;
    if(this.commonService.ys_features.indexOf('testimonials') !== -1) this.layoutTypes.push({ name: "Testimonial", value: "testimonial" });
    if(this.commonService.ys_features.indexOf('shopping_assistant') !== -1) this.layoutTypes.push({ name: "Shopping Assistant", value: "shopping_assistant" });
    if(this.commonService.ys_features.indexOf('blogs') !== -1) this.layoutTypes.push({ name: "Blogs", value: "blogs" });
    if(this.commonService.ys_features.indexOf('shop_the_look') !== -1) this.layoutTypes.push({ name: "Shop the Look", value: "shop_the_look" });
    this.pageLoader = true;
    this.api.LAYOUT_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAddNewSgment(modalName) {
    if(!this.commonService.deploy_stages.logo)
      this.commonService.openDeployAlertModal('logo', 'Please add logo for your business before adding a new segment');
    else if(!this.themeColorExists)
      this.commonService.openDeployAlertModal('color', 'Please set colors for your website before adding a new segment');
    else if(this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else {
      this.addForm = { layout_list: [{}], rank: this.maxRank+1 };
      this.modalService.open(modalName, {size: 'lg'});
    }
  }

  onAdd() {
    if(this.addForm.type!="multiple_featured_product") delete this.addForm.multitab_list;
    this.api.ADD_LAYOUT(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeAddModal').click();
				this.ngOnInit();
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEditDetails(x, modalName) {
    this.api.LAYOUT_DETAILS(x._id).subscribe(result => {
			if(result.status) {
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
        this.editForm.dup_type = this.findType(this.editForm.type);
        if(this.editForm.section_grid_type) {
          this.editForm.dup_grid_type = this.findGridType(this.editForm.section_grid_type);
        }
				this.modalService.open(modalName, {size: 'lg'});
			}
			else console.log("response", result);
		});
  }

  // UPDATE
	onUpdate() {
		this.api.UPDATE_LAYOUT(this.editForm).subscribe(result => {
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
    this.deleteForm.btnLoader = true;
    this.api.DELETE_LAYOUT(this.deleteForm).subscribe(result => {
      this.deleteForm.btnLoader = false;
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

  onResetLayout(modalName) {
    if(!this.commonService.deploy_stages.logo)
      this.commonService.openDeployAlertModal('logo', 'Please add logo for your business before adding a new segment');
    else if(!this.themeColorExists)
      this.commonService.openDeployAlertModal('color', 'Please set colors for your website before adding a new segment');
    else {
      this.deleteForm = {};
      if(modalName) this.modalService.open(modalName, { centered: true });
      else {
        this.deleteForm.btnLoader = true;
        this.api.RESET_LAYOUT().subscribe(result => {
          this.deleteForm.btnLoader = false;
          if(result.status) {
            if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
            this.ngOnInit();
          }
          else {
            this.deleteForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
    }
  }

  findType(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value==type);
    if(index!=-1) return this.layoutTypes[index].name;
    else return "";
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(obj => obj.type==type);
    if(index!=-1) return this.commonService.grid_list[index].name;
    else return "";
  }

}