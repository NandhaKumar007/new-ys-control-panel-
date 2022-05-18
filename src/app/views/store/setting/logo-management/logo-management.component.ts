import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-logo-management',
  templateUrl: './logo-management.component.html',
  styleUrls: ['./logo-management.component.scss']
})

export class LogoManagementComponent implements OnInit {

  uploadForm: any = {}; logoForm: any = {}; verNum: any;
  imgBaseUrl = environment.img_baseurl; btnLoader: boolean;

  colorList: any = [];
  storeLogo: string;
  colorFields: any = [
    { name: "Choose Primary Color", keyword: "primary", color_code: "" },
    { name: "Choose Secondary Color", keyword: "secondary", color_code: "" }
  ];
  colorSections: any = [];
  errorMsg: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService,
    private router: Router, public commonService: CommonService, private api: DeploymentService
    ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.verNum = new Date().valueOf();
    this.uploadForm = {}; this.logoForm = {}; this.colorList = []; this.colorSections = [];
    this.storeLogo = environment.img_baseurl+'uploads/'+this.commonService.store_details._id+'/logo.png?v='+this.commonService.verNum;
    if(this.commonService.deploy_details.theme_colors) {
      let x = this.commonService.deploy_details.theme_colors;
      for(let key in x) {
        if(x.hasOwnProperty(key)) this.colorSections.push({ name: key, value: x[key] });
      }
    }
  }

  onUpdate() {
    this.btnLoader = true;
    this.storeApi.UPDATE_LOGO(this.uploadForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
				this.uploadForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }

  uploadChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.uploadForm.image = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // DEPLOYMENT LOGO SECTION
  uploadLogo(modalName) {
    this.logoForm.submit = true; this.colorList = [];
    this.logoForm.store_id = this.commonService.store_details._id;
    this.api.UPDATE_STORE_LOGO(this.logoForm).subscribe(result => {
      this.updateDeployStatus();
      this.commonService.verNum = new Date().valueOf();
      this.ngOnInit();
      if(result.status) {
        let filteredList = new Set(result.colors);
        this.colorList = Array.from(filteredList);
        this.modalService.open(modalName, { size: 'lg'});
      }
      else {
				this.logoForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }
  updateDeployStatus() {
    if(!this.commonService.deploy_stages['logo']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.logo": true };
      this.api.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  findColors(modalName) {
    this.btnLoader = true;
    this.api.LOGO_COLORS({ file_name: this.storeLogo }).subscribe(result => {
      this.btnLoader = false;
      this.ngOnInit();
      if(result.status) {
        let filteredList = new Set(result.colors);
        this.colorList = Array.from(filteredList);
        if(this.colorList.length) {
          if(this.commonService.deploy_details.theme_colors) {
            this.colorFields.forEach(element => {
              let existColorCode = this.commonService.deploy_details.theme_colors[element.keyword];
              element.color_code = existColorCode;
              if(this.colorList.indexOf(existColorCode)==-1) element.manual_status = true;
            });
          }
          else {
            this.colorFields.forEach(element => {
              element.color_code = this.colorList[0];
            });
          }
        }
        this.modalService.open(modalName, { size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  updateThemeColor(modalName) {
    delete this.errorMsg; let colorForm = {};
    this.colorFields.forEach(element => {
      if(!element.color_code) this.errorMsg = "Please select color from all sections";
      colorForm[element.keyword] = element.color_code;
    });
    if(!this.errorMsg) {
      this.btnLoader = true;
      this.api.UPDATE_DEPLOY_DETAILS({ store_id: this.commonService.store_details._id, theme_colors: colorForm }).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          document.getElementById("closeModal").click();
          this.commonService.deploy_details = result.data;
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          if(result.layout_created) this.modalService.open(modalName, { windowClass:'xxlModal' });
          else this.ngOnInit();
        }
        else console.log("response", result);
      });
    }
  }

  fileChangeListener(event, modalName) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.logoForm.image = (<FileReader>event.target).result;
        this.logoForm.img_change = true;
        this.uploadLogo(modalName);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}