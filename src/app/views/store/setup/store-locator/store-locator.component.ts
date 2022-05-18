import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss'],
  animations: [SharedAnimations]
})

export class StoreLocatorComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; pageLoader: boolean;
  addForm: any; editForm: any; deleteForm: any;
  maxRank: any = 0; search_bar: string;
  settingForm: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.LOCATION_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.data.location_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
  onAdd() {
    this.api.ADD_LOCATION(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.data.location_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.editForm = { _id: x._id, name: x.name, rank: x.rank, mobile: x.mobile, address: x.address, map_url: x.map_url };
    this.editForm.prev_rank = this.editForm.rank;
    this.modalService.open(modalName);
  }

  // UPDATE
  onUpdate() {
    this.api.UPDATE_LOCATION(this.editForm).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.location_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
			else {
				this.editForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_LOCATION(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.location_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // PAGE SETTING
  onUpdateSetting() {
    this.api.UPDATE_LOCATION_CONFIG({ "page_config": this.settingForm }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.location_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}