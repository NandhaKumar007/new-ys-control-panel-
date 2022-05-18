import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';
import { resource } from 'selenium-webdriver/http';

@Component({
  selector: 'app-extra-pages',
  templateUrl: './extra-pages.component.html',
  styleUrls: ['./extra-pages.component.scss'],
  animations: [SharedAnimations]
})

export class ExtraPagesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; deleteForm: any;
  pageLoader: boolean; search_bar: string;

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.EXTRA_PAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.list = result.list;
      else console.log("response", result);
    });
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_EXTRA_PAGE(this.deleteForm).subscribe(result => {
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
