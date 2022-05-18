import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-sizing-assistant',
  templateUrl: './sizing-assistant.component.html',
  styleUrls: ['./sizing-assistant.component.scss'],
  animations: [SharedAnimations]
})

export class SizingAssistantComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean; list: any = []; measurementList: any = [];
  addForm: any = {}; editForm: any = {}; deleteForm: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.SIZING_ASSISTANT_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    this.api.MEASUREMENT_LIST().subscribe(result => {
      if(result.status) this.measurementList = result.list;
    });
  }

  // Add
  onOpenAddModal(modalName) {
    this.addForm = {};
    this.measurementList.forEach(element => { delete element.mm_checked; });
    this.modalService.open(modalName, { size: 'lg'});
  }
  onAdd() {
    this.addForm.mm_list = [];
    this.measurementList.forEach(element => {
      if(element.mm_checked) this.addForm.mm_list.push({ mmset_id: element._id });
    });
    this.api.ADD_SIZING_ASSISTANT(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.list;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // Edit
  onEdit(x, modalName) {
    this.api.SIZING_ASSISTANT_DETAILS(x._id).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.measurementList.forEach(element => {
          delete element.mm_checked;
          if(this.editForm.mm_list.findIndex(obj => obj.mmset_id==element._id) != -1) element.mm_checked = true;
        });
        this.modalService.open(modalName, { size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdate() {
    this.editForm.mm_list = [];
    this.measurementList.forEach(element => {
      if(element.mm_checked) this.editForm.mm_list.push({ mmset_id: element._id });
    });
    this.api.UPDATE_SIZING_ASSISTANT(this.editForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.list;
			}
			else {
				this.editForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // Delete
  onDelete() {
    this.api.DELETE_SIZING_ASSISTANT(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  onViewOptions(x) {
    let mmSets = [];
    this.measurementList.forEach(element => {
      if(x.mm_list.findIndex(obj => obj.mmset_id==element._id) != -1) mmSets.push(element);
    });
    sessionStorage.setItem("sizing_mm_sets", this.commonService.encryptData(mmSets));
    this.router.navigate(['/product-extras/sizing-assistant/'+x._id]);
  }

}