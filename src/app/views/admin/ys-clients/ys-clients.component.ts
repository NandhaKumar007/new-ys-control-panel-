import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ys-clients',
  templateUrl: './ys-clients.component.html',
  styleUrls: ['./ys-clients.component.scss'],
  animations: [SharedAnimations]
})

export class YsClientsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean; parent_list: any = []; list: any = [];
  imgBaseUrl = environment.img_baseurl; buildForm: any = {};
  filterForm = { list_type: 'active', expiry_day: '15', day_type: 'eq', inactive_day: '3' };
  pwdForm: any = {}; deleteForm: any = {}; settingForm: any = {};
  verNum: any = new Date().getFullYear()+''+new Date().getMonth()+''+new Date().getDate()+''+new Date().getHours();
  configData: any = environment.config_data;
  exportLoader: boolean;

  constructor(private datepipe: DatePipe, config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService, private excelService: ExcelService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    let tempServices = {
      order_based: 'B2C', quot_based: 'B2B', service_based: 'Service',
      multi_vendor: 'Multi-Vendor', restaurant_based: 'Restaurant'
    };
    this.pageLoader = true; this.page = 1;
    let filterType = "type="+this.filterForm.list_type;
    if(this.filterForm.list_type=='trial_expires_in') {
      let trialDate = new Date().setDate(new Date().getDate() + parseInt(this.filterForm.expiry_day));
      filterType += "&from="+new Date(trialDate).setHours(0,0,0,0);
      filterType += "&to="+new Date(trialDate).setHours(23,59,59,999);
      filterType += "&day_type="+this.filterForm.day_type;
    }
    if(this.filterForm.list_type=='unused') {
      let inactiveDay = new Date().setDate(new Date().getDate() - parseInt(this.filterForm.inactive_day));
      filterType += "&from="+new Date(inactiveDay).setHours(0,0,0,0);
      filterType += "&to="+new Date(inactiveDay).setHours(23,59,59,999);
      filterType += "&day_type="+this.filterForm.day_type;
    }
    this.adminApi.STORE_LIST(filterType).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.list.forEach(obj => {
          obj.account_expiry = obj.package_details.trial_expiry;
          if(obj.package_details.billing_status && obj.package_details.expiry_date) {
            obj.account_expiry = obj.package_details.expiry_date;
          }
          obj.package_name = "NA";
          let packIndex = this.commonService.admin_packages.findIndex(x => x._id==obj.package_details.package_id);
          if(packIndex!=-1) {
            obj.package_name = this.commonService.admin_packages[packIndex].name;
            obj.package_category = this.commonService.admin_packages[packIndex].category;
            obj.package_service = tempServices[this.commonService.admin_packages[packIndex].service];
          }
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSendNotification() {
    this.pwdForm.submit = true;
    this.pwdForm.type = this.filterForm.list_type;
    if(this.filterForm.list_type=='trial_expires_in') {
      let trialDate = new Date().setDate(new Date().getDate() + parseInt(this.filterForm.expiry_day));
      this.pwdForm.from = new Date(trialDate).setHours(0,0,0,0);
      this.pwdForm.to = new Date(trialDate).setHours(23,59,59,999);
    }
    this.adminApi.SEND_NOTIFICATION(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) document.getElementById("closeModal").click();
      else {
        console.log("response", result);
        this.pwdForm.errorMsg = result.message;
      }
    });
  }

  onUpdatePwd() {
    this.adminApi.CHANGE_STORE_PWD({ store_id: this.pwdForm._id, new_pwd: this.pwdForm.new_pwd }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.pwdForm.errorMsg = result.message;
      }
    });
  }

  onUpdateStatus() {
    let storeStatus = 'active';
    if(this.deleteForm.status=='active') storeStatus = 'inactive';
    this.adminApi.UPDATE_STORE({ _id: this.deleteForm._id, status: storeStatus, session_key: new Date().valueOf() }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  onDelete() {
    if(this.deleteForm.status=='inactive') {
      this.adminApi.DELETE_STORE({ _id: this.deleteForm._id }).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          console.log("response", result);
          this.deleteForm.errorMsg = result.message;
        }
      });
    }
    else this.deleteForm.errorMsg = "Invalid store";
  }

  onUpdateSetting() {
    this.adminApi.UPDATE_STORE({ _id: this.settingForm._id, additional_features: this.settingForm.additional_features }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.settingForm.errorMsg = result.message;
      }
    });
  }

  openBuildInfoModal(x, modalName) {
    this.buildForm = { _id: x._id, name: x.name, website: x.website, build_details: x.build_details };
    this.modalService.open(modalName);
  }
  manualDeploy() {
    this.buildForm.submit = true;
    this.adminApi.MANUAL_DEPLOY(this.buildForm._id).subscribe(result => {
      this.buildForm.submit = false;
      if(result.status) this.ngOnInit();
      else {
        console.log("response", result);
        this.buildForm.errorMsg = result.message;
      }
    });
  }
  checkBuildStatus() {
    this.buildForm.submit = true;
    this.adminApi.CHECK_BUILD_STATUS(this.buildForm._id).subscribe(result => {
      this.buildForm.submit = false;
      if(result.status) this.ngOnInit();
      else {
        console.log("response", result);
        this.buildForm.errorMsg = result.message;
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.pwdForm.image = (<FileReader>event.target).result;
        this.pwdForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  sendWhatsapp(x) {
    let msgContent = "Dear "+x.company_details.contact_person+",%0a%0a";
    msgContent += "Greetings from Yourstore!%0a%0a";
    msgContent += "Thank you for setting up your website with us.%0a%0a";
    msgContent += "To continue setup, use chrome browser to access the website%0a%0a";
    msgContent += "yourstore.io/login%0a";
    msgContent += "Enter your login id and password used on signup%0a%0a";
    msgContent += "To Install Yourstore as an app,%0a";
    msgContent += "Click  “Add Yourstore to Home screen” when prompted in chrome browser on opening yourstore.io/login to Install as app to get live order notification and for easy access.%0a%0a";
    msgContent += "No store logo?%0a";
    msgContent += "Do not worry, use logomaker.net to generate free logo for your website.%0a%0a";
    msgContent += "Please feel free to get in touch with us on this number for any queries and guidance.%0a%0a";
    msgContent += "Cheers to more sales,%0a";
    msgContent += "Team yourstore.io";
    let url = "https://api.whatsapp.com/send?phone="+x.company_details.dial_code.replace("+", "")+x.company_details.mobile+"&text="+msgContent;
    window.open(url, '_blank');
  }

  exportAsXLSX() {
    let fileName = "store-list";
    this.exportLoader = true; let exportList = [];
    this.list.forEach(obj => {
      let sendData = {};
      sendData['Store Name'] = obj.name;
      sendData['Type'] = 'Genie';
      if(obj.package_category=='pro' && obj.package_service) sendData['Type'] = obj.package_service;
      sendData['Name'] = obj.company_details.contact_person;
      sendData['Phone Number'] = obj.company_details.dial_code+' '+obj.company_details.mobile;
      sendData['Email ID'] = obj.email;
      sendData['Plan'] = "Trial";
      sendData['Created On'] = this.datepipe.transform(new Date(obj.activated_on), 'dd MMM y');
      sendData['City'] = obj.company_details.city;
      sendData['State'] = obj.company_details.state;
      sendData['Country'] = obj.country;
      sendData['Category'] = "";
      sendData['URL '] = obj.base_url;
      if(obj.package_details.billing_status) sendData['Plan'] = obj.package_name;
      exportList.push(sendData);
    });
    this.excelService.exportAsExcelFile(exportList, fileName);
    setTimeout(() => { this.exportLoader = false; }, 500);
  }

}