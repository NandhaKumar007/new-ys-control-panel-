import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})

export class BillingComponent implements OnInit {

  pageLoader: boolean; billingStatus: boolean;
  billDetails: any = {}; paymentTypes: any = [];
  environment: any = environment; paymentData: any = {};
  razorpayOptions: any = {
    my_order_type: "plan_renewal",
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  enablePayment: boolean;
  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService, public router: Router,
    private sbService: SidebarService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.BILLING_DETAILS({ store_id: this.commonService.store_details._id, month: 1 }).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.billDetails = result.data;
        this.billDetails.current_date = new Date();
        this.paymentTypes = result.payment_types;
        this.paymentData = result.payment_data;
        if(this.billDetails.store_package_details.billing_status && this.billDetails.store_package_details.expiry_date) {
          this.billingStatus = true;
          this.billDetails.payable_amount = this.billDetails.subscription_charge + this.billDetails.addon_price + this.billDetails.transaction_charges;
          this.billDetails.credit = this.billDetails.store_package_details.credit;
          if(this.billDetails.store_package_details.transaction_range && this.billDetails.store_package_details.transaction_range.to) {
            if(new Date() > new Date(this.billDetails.store_package_details.transaction_range.to)) this.enablePayment = true;
          }
          if(this.billDetails.store_package_details.credit >= this.billDetails.payable_amount) {
            this.billDetails.credit = this.billDetails.payable_amount;
            this.billDetails.payable_amount = 0;
          }
          else this.billDetails.payable_amount = this.billDetails.payable_amount - this.billDetails.store_package_details.credit;
        }
        if(this.billDetails.store_package_details.trial_expiry)
          this.billDetails.store_package_details.trial_expiry = new Date(this.billDetails.store_package_details.trial_expiry);
      }
      else console.log("response", result);
    });
  }

  onSubscribe(x) {
    this.billDetails.submit = true;
    this.api.BILLING_DETAILS({ store_id: this.commonService.store_details._id, payment_details: { name: x.name }, month: 1 }).subscribe(result => {
      if(result.status) {
        if(result.data) {
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
          this.storeApi.ADV_STORE_DETAILS().subscribe(result => {
            document.getElementById('closeModal').click();
            if(result.status) this.sbService.resetStoreDetails(result);
            else console.log("response", result);
          });
        }
      }
      else {
        this.billDetails.submit = false;
        this.billDetails.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}