import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-dp-wallet-mgmt',
  templateUrl: './dp-wallet-mgmt.component.html',
  styleUrls: ['./dp-wallet-mgmt.component.scss'],
  animations: [SharedAnimations]
})

export class DpWalletMgmtComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; orderForm: any = {};
  environment: any = environment;
  filterForm:any = {};
  razorpayOptions: any = {
    my_order_type: "dp_wallet",
    customer_email: this.commonService.store_details.email,
    customer_name: this.commonService.store_details.company_details.name,
    customer_mobile: this.commonService.store_details.company_details.mobile
  };
  balance: number = 0;

  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, public commonService: CommonService, public router: Router) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }

  getList() {
    this.pageLoader = true;
    this.api.WALLET_STATEMENT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.balance = result.balance;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onTopup() {
    this.orderForm.submit = true;
    this.api.WALLET_TOPUP({ order_price: this.orderForm.price, order_info: "Top Up", payment_details:{ name: "Razorpay" } }).subscribe(result => {
      this.orderForm.submit = false;
      if(result.status) {
        let paymentConfig = result.data.payment_config;
        this.razorpayOptions.my_order_id = result.data.order_id;
        this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
        this.razorpayOptions.key = paymentConfig.key;
        this.razorpayOptions.store_name = paymentConfig.name;
        this.razorpayOptions.description = paymentConfig.description;
        setTimeout(_ => this.razorpayForm.nativeElement.submit());
      }
      else {
        this.orderForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}