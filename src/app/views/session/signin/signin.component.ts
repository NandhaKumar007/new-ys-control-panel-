import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';
import { AccountService } from '../../store/account/account.service';
import { ShippingService } from '../../store/shipping/shipping.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})

export class SigninComponent implements OnInit {

  loading: boolean; loadingText: string;
  loginForm: any = {}; pageLoader: boolean;
  constructor(
    public router: Router, private storeApi: StoreApiService, private api: ApiService, private sidebar: SidebarService,
    private commonService: CommonService, private accApi: AccountService, private shipService: ShippingService
  ) { }

  ngOnInit() {
    sessionStorage.removeItem("formData");
    this.loading = false; this.loadingText = "";
    if(this.router.url=='/session/signin' && environment.keep_login && localStorage.getItem("store_token")) {
      this.pageLoader = true;
      this.commonService.store_token = localStorage.getItem("store_token");
      this.restoreStoreLogin();
    }
    else localStorage.clear();
  }

  signin() {
    this.loading = true; this.loadingText = 'Signing in...';
    if(this.router.url.indexOf('master')!=-1) this.masterLogin();
    else this.storeLogin();
  }

  storeLogin() {
    if(sessionStorage.getItem("app_token")) this.loginForm.app_token = sessionStorage.getItem("app_token");
    this.api.LOGIN(this.loginForm).subscribe(result => {
      console.log("login result",result)
      this.loading = false; this.loadingText = "";
      if(result.status) {
        localStorage.setItem("store_token", result.token);
        this.commonService.store_details = {
          type: result.data.type,
          login_email: this.loginForm.email,
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
        if(result.data.status=='active') {
          // ys features
          if(!result.ys_features) result.ys_features = [];
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
          // sub-user features
          if(!result.subuser_features) result.subuser_features = [];
          this.commonService.subuser_features = result.subuser_features;
          this.commonService.updateLocalData('subuser_features', this.commonService.subuser_features);
          // vendor features
          this.commonService.vendor_features = [];
          this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
          this.sidebar.BUILD_CATEGORY_LIST();
          if(result.data.last_login) {
            if(sessionStorage.getItem("redirect_url")) {
              let redirectUrl = sessionStorage.getItem("redirect_url");
              sessionStorage.removeItem("redirect_url");
              this.router.navigateByUrl(redirectUrl);
            }
            else this.router.navigateByUrl('/dashboard');
          }
          else this.router.navigateByUrl('/welcome/activated');
        }
        else {
          this.commonService.route_permission_list = ["deployment", "billing"];
          this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
          this.router.navigateByUrl('/account/billing');
        }
      }
      else {
        this.loginForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  masterLogin() {
    this.api.MASTER_LOGIN(this.loginForm).subscribe(result => {
      this.loading = false; this.loadingText = "";
      if(result.status) {
        this.commonService.ys_payment_list = result.payment_types;
        this.commonService.updateLocalData('ys_payment_list', this.commonService.ys_payment_list);
        this.commonService.master_token = result.token;
        localStorage.setItem("master_token", this.commonService.master_token);
        this.router.navigateByUrl('/control-panel');
      }
      else {
        this.loginForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  restoreStoreLogin() {
    this.storeApi.ADV_STORE_DETAILS().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status && !result.session_out) {
        this.commonService.store_details = {
          type: result.data.type,
          login_email: this.loginForm.email,
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
        if(!result.ys_features) result.ys_features = [];
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
        // sub-user features
        if(!result.subuser_features) result.subuser_features = [];
        this.commonService.subuser_features = result.subuser_features;
        this.commonService.updateLocalData('subuser_features', this.commonService.subuser_features);
        // vendor features
        this.commonService.vendor_features = [];
        this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
        this.sidebar.BUILD_CATEGORY_LIST();
        this.router.navigateByUrl('/dashboard');
      }
      else {
        console.log("response", result);
        localStorage.clear();
      }
    });
  }

}