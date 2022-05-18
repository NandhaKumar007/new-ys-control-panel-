import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-dinamic-offers',
  templateUrl: './dinamic-offers.component.html',
  styleUrls: ['./dinamic-offers.component.scss'],
  animations: [SharedAnimations]
})

export class DinamicOffersComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; pageLoader: boolean;
  addForm: any; editForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  maxRank: any = 0; search_bar: string;
  productList: any = []; settingForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.DINAMIC_OFFER_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_DINAMIC_OFFER(this.deleteForm).subscribe(result => {
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

}