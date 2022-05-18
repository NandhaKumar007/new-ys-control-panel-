import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../account.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { DeploymentService } from '../../../deployment/deployment.service';
import { CommonService } from '../../../../../services/common.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-app-store-payments',
  templateUrl: './app-store-payments.component.html',
  styleUrls: ['./app-store-payments.component.scss']
})
export class AppStorePaymentsComponent implements OnInit {

  pageLoader: boolean;
  list: any= []; payment_types: any = [];
  imgBaseUrl = environment.img_baseurl;
  paymentData: any = {};
  environment: any = environment;
  razorpayOptions: any = {
    my_order_type: "purchase_app",
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  payForm: any = {}; formData: any = {};

  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, private deployApi: DeploymentService,
    public commonService: CommonService, public router: Router, private sbService: SidebarService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.YS_FEATURES_CREATE_PAYMENT({}).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.list = result.list;
        this.payment_types = result.payment_types;
        this.paymentData = result.data;
      }
      else console.log("response", result);
    });
  }

  openModal(modalName) {
    delete this.formData.submit;
    delete this.formData.errorMsg;
    this.modalService.open(modalName, { centered: true });
  }

  onUninstall(x) {
    x.submit = true;
    this.api.UNINSTALL_FEATURE({ feature_id: x._id }).subscribe(result => {
      setTimeout(() => { x.submit = false; }, 500);
      if(result.status) {
        let deployDetails = result.data;
        this.storeApi.STORE_DETAILS().subscribe(result => {
          setTimeout(() => { x.submit = false; }, 500);
          if(result.status) {
            document.getElementById('closeModal').click();
            if(this.commonService.uninstallApp(x.keyword, result.data)) this.sbService.getSidePanelList();
            this.ngOnInit();
          }
          else {
            x.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else {
        setTimeout(() => { x.submit = false; }, 500);
        x.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  makePayment(x) {
    this.payForm.submit = true;
    this.api.YS_FEATURES_CREATE_PAYMENT({ payment_details: { name: x.name } }).subscribe(result => {
      if(result.status) {
        if(x.name=="Razorpay") {
          let paymentConfig = result.data.payment_config;
          this.razorpayOptions.my_order_id = result.data.order_id;
          this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
          this.razorpayOptions.key = paymentConfig.key;
          this.razorpayOptions.store_name = paymentConfig.name;
          this.razorpayOptions.description = paymentConfig.description;
          setTimeout(_ => this.razorpayForm.nativeElement.submit());
        }
        else console.log("Invalid payment method");
      }
      else {
        this.payForm.submit = false;
        this.payForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}