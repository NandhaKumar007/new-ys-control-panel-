import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss'],
  animations: [SharedAnimations]
})

export class MeasurementsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
	list: any = []; maxRank: any = 0;
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; btnLoader: boolean;
  imgBaseUrl = environment.img_baseurl;

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
		this.api.MEASUREMENT_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;
      }
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // ADD
	onAdd() {
    this.btnLoader = true;
		this.api.ADD_MEASUREMENT(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.list;
				this.maxRank = this.list.length;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
      }
      this.btnLoader = false;
		});
	}

	// EDIT
  onEdit(x, modalName) {
    this.btnLoader = false;
    this.api.MEASUREMENT_LIST().subscribe(result => {
			if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = result.list[index];
          this.editForm.prev_rank = this.editForm.rank;
          this.modalService.open(modalName, {size: 'lg'});
        }
        else console.log("Invalid measurement set");
      }
			else console.log("response", result);
		});
  }

  // UPDATE
	onUpdate() {
    this.btnLoader = true;
		this.api.UPDATE_MEASUREMENT(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
      this.btnLoader = false;
		});
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_MEASUREMENT(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(type=='add') {
          this.addForm.image = (<FileReader>event.target).result;
          this.addForm.img_change = true;
        }
        else {
          this.editForm.image = (<FileReader>event.target).result;
          this.editForm.img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onAddCondition(x, type) {
    let mmConditionList = [];
    if(type=='add') {
      this.addForm.units.forEach(element => {
        mmConditionList.push({ unit: element.name });
      });
      x.conditions.push({ list: mmConditionList });
    }
    else {
      this.editForm.units.forEach(element => {
        mmConditionList.push({ unit: element.name });
      });
      x.conditions.push({ list: mmConditionList });
    }
  }

}