import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-foot-note',
  templateUrl: './foot-note.component.html',
  styleUrls: ['./foot-note.component.scss'],
  animations: [SharedAnimations]
})

export class FootNoteComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.FOOTNOTE_LIST().subscribe(result => {
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
    this.api.ADD_FOOTNOTE(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.list;
				this.maxRank = this.list.length;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.api.FOOTNOTE_LIST().subscribe(result => {
			if(result.status) {
        let noteList = result.list;
        let index = noteList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = noteList[index];
          this.editForm.prev_rank = this.editForm.rank;
          this.modalService.open(modalName, {size: "lg"});
        }
        else console.log("invalid foot note");
      }
      else console.log("response", result);
		});
  }
  
  // UPDATE
  onUpdate() {
		this.api.UPDATE_FOOTNOTE(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_FOOTNOTE(this.deleteForm).subscribe(result => {
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

}