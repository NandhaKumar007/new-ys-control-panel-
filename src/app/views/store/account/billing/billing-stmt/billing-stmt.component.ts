import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../../services/common.service';
import { DeploymentService } from '../../../deployment/deployment.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-billing-stmt',
  templateUrl: './billing-stmt.component.html',
  styleUrls: ['./billing-stmt.component.scss'],
  animations: [SharedAnimations]
})

export class BillingStmtComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; filterForm:any = {};
  packageDetails: any = {}; selectedBill: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }

  getList() {
    this.pageLoader = true;
    this.api.BILLING_STMT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.packageDetails = result.packages;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}