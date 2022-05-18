import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { SidebarService } from '../../../../../services/sidebar.service';
import { DeploymentService } from '../../../deployment/deployment.service';
import { AccountService } from '../../account.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})

export class AppDetailsComponent implements OnInit {

  pageLoader: boolean;
  featureDetails: any = {};
  imgBaseUrl = environment.img_baseurl;
  selectedImageIndex: number = 1;
  packageInfo: any; appDetails: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute, private storeApi: StoreApiService,
    private deployApi: DeploymentService, private api: AccountService, public commonService: CommonService, private sbService: SidebarService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      if(this.commonService.store_details.package_details && this.commonService.store_details.package_details.billing_status) {
        this.api.YS_FEATURE_DETAILS(params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            let packageList = result.packages;
            this.featureDetails = result.data;
            let trialFeatures = result.deploy_details.trial_features;
            this.featureDetails.linked_packages.forEach(element => {
              if(this.commonService.store_details.package_details.package_id==element.package_id) {
                this.packageInfo = element;
              }
              let packIndex = packageList.findIndex(obj => obj._id==element.package_id);
              if(packIndex!=-1) {
                element.package_name = packageList[packIndex].name;
                element.package_rank = packageList[packIndex].rank;
              }
            });
            let aIndex = trialFeatures.findIndex(obj => obj.name==this.featureDetails.keyword);
            if(aIndex!=-1) this.appDetails = trialFeatures[aIndex];
          }
          else console.log("response", result);
        });
      }
      else this.router.navigate(["/account/app-store"]);
    });
  }

  openModal(type, modalName) {
    delete this.featureDetails.submit;
    delete this.featureDetails.errorMsg;
    this.featureDetails.form_type = type;
    this.modalService.open(modalName, { centered: true });
  }

  onSubmit(x) {
    x.submit = true;
    if(x.form_type=='install') {
      this.api.INSTALL_FEATURE({ feature_id: x._id }).subscribe(result => {
        setTimeout(() => { x.submit = false; }, 500);
        if(result.status) {
          document.getElementById('closeModal').click();
          if(result.make_payment) this.router.navigate(['/account/app-store/payments']);
          else {
            // deploy details
            this.commonService.deploy_details = result.data;
            delete this.commonService.deploy_details.deploy_stages;
            this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
            // paid features
            let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
            if(trialFeatures.length) {
              trialFeatures.forEach(obj => {
                let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
                if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                  this.commonService.ys_features.push(obj.name);
                }
              });
            }
            this.sbService.getSidePanelList();
            this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
            this.ngOnInit();
          }
        }
        else {
          x.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UNINSTALL_FEATURE({ feature_id: x._id }).subscribe(result => {
        if(result.status) {
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
  }

}
