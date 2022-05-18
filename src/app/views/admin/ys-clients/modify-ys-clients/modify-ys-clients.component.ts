import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AdminApiService } from '../../../../services/admin-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-modify-ys-clients',
  templateUrl: './modify-ys-clients.component.html',
  styleUrls: ['./modify-ys-clients.component.scss']
})

export class ModifyYsClientsComponent implements OnInit {

  pageLoader: boolean;
  packages_list: any = this.commonService.admin_packages;
  features_list: any = this.commonService.admin_features;
  free_features_list: any = []; paid_features_list: any = [];
  clientForm: any; step_num: number;
  imgBaseUrl = environment.img_baseurl; state_list: any = [];
  currencyList: any = this.commonService.currency_types.filter(obj => obj.store_base);

  constructor(private router: Router, private activeRoute: ActivatedRoute, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.step_num = 1;
      if(params.client_id) {
        this.pageLoader = true;
        this.adminApi.STORE_DETAILS({ _id: params.client_id }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.clientForm = result.data;
            this.clientForm.formType = 'update';
            this.clientForm.currency_types = this.clientForm.currency_types[0];
            this.onCountryChange(this.clientForm.country);
            if(this.clientForm.package_details.billing_status) {
              this.clientForm.package_details.expiry_date = new Date(this.clientForm.package_details.expiry_date);
              this.clientForm.package_details.transaction_range.from = new Date(this.clientForm.package_details.transaction_range.from);
              this.clientForm.package_details.transaction_range.to = new Date(this.clientForm.package_details.transaction_range.to);
            }
            if(this.clientForm.package_details.trial_expiry)
              this.clientForm.package_details.trial_expiry = new Date(this.clientForm.package_details.trial_expiry);
          }
          else console.log("response", result);
        });
      }
      else this.clientForm = { formType: 'add', company_details: {}, currency_types: {} };
    });
  }

  onSubmit() {
    if(!this.clientForm.dp_wallet_status) this.clientForm.dp_wallet_status = false;
    this.clientForm.package_details.paid_features = [];
    this.paid_features_list.forEach(element => {
      if(element.feature_checked) this.clientForm.package_details.paid_features.push(element.keyword);
    });
    if(this.clientForm.type!='order_based') this.clientForm.abandoned_status = false;
    this.clientForm.btnLoader = true;
    let formData: any = {
      _id: this.clientForm._id, name: this.clientForm.name, account_type: this.clientForm.account_type, type: this.clientForm.type,
      company_details: this.clientForm.company_details, gst_no: this.clientForm.gst_no, package_details: this.clientForm.package_details,
      abandoned_status: this.clientForm.abandoned_status, dp_wallet_status: this.clientForm.dp_wallet_status
    }
    if(this.clientForm.dp_wallet_details) formData.dp_wallet_details = this.clientForm.dp_wallet_details;
    this.adminApi.UPDATE_STORE(formData).subscribe(result => {
      if(result.status) this.router.navigate(['/admin/clients']);
      else {
        console.log("response", result);
        this.clientForm.errorMsg = result.message;
        this.clientForm.btnLoader = false;
      }
    });
  }

  onChoosePackage() {
    this.clientForm.add_features = false;
    if(this.clientForm.package_details.paid_features.length) this.clientForm.add_features = true;
    if(this.clientForm.package_details.billing_status) {
      this.clientForm.package_details.subscription_start_date = new Date(this.clientForm.package_details.subscription_start_date);
      this.clientForm.package_details.expiry_date = new Date(this.clientForm.package_details.expiry_date);
    }
    if(!this.clientForm.package_details.package_id && this.packages_list.length) {
      this.clientForm.package_details.package_id = this.packages_list[0]._id;
    }
    this.free_features_list = []; this.paid_features_list = [];
    this.features_list.forEach(element => {
      let packIndex = element.linked_packages.findIndex(obj => obj.package_id==this.clientForm.package_details.package_id);
      if(packIndex!=-1) {
        delete element.feature_checked;
        element.package_pricing = element.linked_packages[packIndex].currency_types;
        if(element.package_pricing[this.clientForm.currency_types.country_code].price > 0) {
          if(this.clientForm.package_details.paid_features.indexOf(element.keyword)!=-1) element.feature_checked = true;
          this.paid_features_list.push(element);
        }
        else this.free_features_list.push(element);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.state_list = this.commonService.country_list[index].states;
      if(!this.clientForm.company_details.dial_code)
        this.clientForm.company_details.dial_code = this.commonService.country_list[index].dial_code;
    }
  }

}