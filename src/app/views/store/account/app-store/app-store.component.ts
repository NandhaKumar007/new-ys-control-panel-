import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { AccountService } from '../account.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})

export class AppStoreComponent implements OnInit {

  pageLoader: boolean;
  selected_package: string = 'all';
  package_list: any = []; notFound: boolean;
  parent_list:any = []; scrollPos: number = 0;
  imgBaseUrl = environment.img_baseurl;
  ys_apps_category: any;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    if(this.router.url=='/account/app-store/apps' && localStorage.getItem("ys_apps")) {
      this.ys_apps_category = this.commonService.decryptData(localStorage.getItem("ys_apps"));
    }
    else {
      delete this.ys_apps_category;
      if(this.commonService.page_attr) {
        let pageInfo = this.commonService.page_attr;
        delete this.commonService.page_attr;
        this.package_list = pageInfo.package_list;
        this.parent_list = pageInfo.parent_list;
        this.scrollPos = pageInfo.scroll_pos;
        this.selected_package = pageInfo.selected_package;
        this.onChange(this.selected_package);
      }
      else {
        this.pageLoader = true; 
        this.api.YS_FEATURES_LIST().subscribe(result => {
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
          if(result.status) {
            this.package_list = result.packages.filter(obj => obj.category==this.commonService.store_details.package_info.category);
            this.parent_list = result.list.filter(obj => obj.linked_packages.length);
            let trialFeatures = result.deploy_details.trial_features.filter(obj => obj.status=='active');
            this.parent_list.forEach(obj => {
              let tIndex = trialFeatures.findIndex(el => el.name==obj.keyword);
              if(tIndex!=-1) obj.deploy_data = trialFeatures[tIndex];
            });
            this.onChange(this.selected_package);
          }
          else console.log("response", result);
        });
      }
    }
  }

  onSelectApp(x) {
    if(this.commonService.store_details.package_details && this.commonService.store_details.package_details.billing_status) {
      this.commonService.page_attr = {
        selected_package: this.selected_package, scroll_pos: this.commonService.scroll_y_pos,
        package_list: this.package_list, parent_list: this.parent_list
      };
      this.router.navigate(["/account/app-store/"+x._id]);
    }
    else this.commonService.openDeployAlertModal('plan', 'Please select a plan first to access the app store');
  }

  viewAll(x) {
    this.commonService.page_attr = {
      selected_package: this.selected_package, scroll_pos: this.commonService.scroll_y_pos,
      package_list: this.package_list, parent_list: this.parent_list
    };
    this.commonService.updateLocalData('ys_apps', x);
    this.router.navigate(['/account/app-store/apps']);
  }

  onChange(x) {
    let list = [];
    if(x!='all') {
      list = this.parent_list.filter(obj => obj.linked_packages.findIndex(el => el.package_id==x)!=-1);
    }
    else {
      let filteredPackageList = [];
      this.package_list.forEach(obj => { filteredPackageList.push(obj._id); });
      list = this.parent_list.filter(obj => obj.linked_packages.findIndex(el => filteredPackageList.indexOf(el.package_id)!=-1)!=-1);
    }
    this.notFound = true;
    this.commonService.feature_categories.forEach(obj => {
      obj.apps = list.filter(el => el.category==obj.name);
      if(obj.apps.length) this.notFound = false;
    });
  }

}
