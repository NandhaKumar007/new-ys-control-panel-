import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { AccountService } from '../../store/account/account.service';
import { ShippingService } from '../../store/shipping/shipping.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  animations: [SharedAnimations]
})

export class ControlPanelComponent implements OnInit {

  loading: boolean; loadingText: string;
  store_id: any; errorMsg: any;

  constructor(
    public router: Router, private adminApi: AdminApiService, private storeApi: StoreApiService, private sidebar: SidebarService,
    public commonService: CommonService, private api: ApiService, private accApi: AccountService, private shipService: ShippingService
  ) { }

  ngOnInit() {
    this.loading = false; this.loadingText = "";
    if(this.commonService.store_details._id) this.store_id = this.commonService.store_details._id;
    if(!this.commonService.store_list.length) {
      this.adminApi.STORE_LIST("type=active").subscribe(result => {
        if(result.status) this.commonService.store_list = result.list;
        else console.log("response", result);
      });
    }
  }

  storePanel() {
    if(this.store_id) {
      this.loading = true; this.loadingText = 'Loading...';
      this.adminApi.GENERATE_STORE_TOKEN({ store_id: this.store_id }).subscribe(result => {
        this.loading = false; this.loadingText = "";
        if(result.status) {
          let masterToken = localStorage.getItem("master_token");
          localStorage.clear(); sessionStorage.clear();
          this.commonService.master_token = masterToken;
          this.commonService.store_token = result.token;
          localStorage.setItem("master_token", this.commonService.master_token);
          localStorage.setItem("store_token", this.commonService.store_token);
          this.commonService.store_details = {
            type: result.data.type,
            login_email: result.data.email,
            login_type: result.login_type,
            _id: result.data._id,
            name: result.data.name,
            email: result.data.email,
            gst_no: result.data.gst_no,
            website: result.data.website,
            base_url: result.data.base_url,
            sub_domain: result.data.sub_domain,
            currency_types: result.data.currency_types,
            country: result.data.country,
            created_on: result.data.created_on,
            additional_features: result.data.additional_features,
            company_details: result.data.company_details,
            package_details: result.data.package_details,
            package_info: result.data.package_info,
            status: result.data.status
          };
          if(result.data.vendor_commission) this.commonService.store_details.vendor_commission = result.data.vendor_commission;
          if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
          let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
          this.commonService.store_currency = result.data.currency_types[currencyIndex];
          this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
          this.commonService.updateLocalData('store_details', this.commonService.store_details);
          // payment list
          this.commonService.payment_list = result.data.payment_types;
          this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
          // deploy stages
          this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
          this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
          // deploy details
          this.commonService.deploy_details = result.data.deployDetails[0];
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          // ys features
          this.commonService.ys_features = result.ys_features;
          // trial features
          let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
          if(trialFeatures.length) {
            trialFeatures.forEach(obj => {
              let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
              if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                this.commonService.ys_features.push(obj.name);
              }
            });
          }
          this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
          // shipping methods
          this.commonService.shipping_list = [];
          this.shipService.SHIPPING_LIST().subscribe(result => {
            if(result.status) this.commonService.shipping_list = result.list.filter(obj => obj.status=='active');
            this.commonService.updateLocalData('shipping_list', this.commonService.shipping_list);
          });
          // vendor list
          this.commonService.vendor_list = [];
          if(this.commonService.ys_features.indexOf('vendors')!=-1) {
            this.accApi.VENDOR_LIST().subscribe(result => {
              if(result.status) this.commonService.vendor_list = result.list.filter(obj => obj.status=='active');
              this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
            });
          }
          else this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
          this.sidebar.BUILD_CATEGORY_LIST();
          this.router.navigateByUrl('/dashboard');
        }
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  clientHub() {
    // live currency
    this.adminApi.YS_CURRENCY_LIST().subscribe(result => {
      this.commonService.currency_types = [];
      if(result.status) result.list.forEach(element => { this.commonService.currency_types.push({ base: element.name, country_code: element.name, html_code: element.html_code, store_base: element.store_base }); });
      this.commonService.updateLocalData('currency_types', this.commonService.currency_types);
    });
    // country list
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
      });
    }
    // packages
    this.adminApi.PACKAGE_LIST().subscribe(result => {
      this.commonService.admin_packages = [];
      if(result.status) this.commonService.admin_packages = result.list;
      this.commonService.updateLocalData('admin_packages', this.commonService.admin_packages);
    });
    // features
    this.adminApi.FEATURE_LIST().subscribe(result => {
      this.commonService.admin_features = [];
      if(result.status) this.commonService.admin_features = result.list;
      this.commonService.updateLocalData('admin_features', this.commonService.admin_features);
    });
    this.router.navigate(['/admin/dashboard']);
  }

}