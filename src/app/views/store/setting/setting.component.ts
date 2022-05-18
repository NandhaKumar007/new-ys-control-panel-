import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { StoreApiService } from '../../../services/store-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {

  settingForm: any = {};
  mailTypes: any = [
    {
      name: "Gmail", value: "gmail",
      transporter : { host: "smtp.gmail.com", port: 465, secure: true }
    },
    {
      name: "Ezveb", value: "ezveb",
      transporter : { host: "lin.ezveb.com", port: 25, secureConnection: false }
    },
    {
      name: "Godaddy", value: "godaddy",
      transporter : { host: "smtpout.secureserver.net", port: 465, secureConnection: true, service: "Godaddy" }
    },
    {
      name: "Outlook", value: "outlook",
      transporter : { host: "smtp-mail.outlook.com", port: 587, secureConnection: false, tls: { ciphers: "SSLv3" } }
    },
    {
      name: "Roundcube", value: "roundcube",
      transporter : { port: 465, secure: true }
    },
    {
      name: "Zoho", value: "zoho",
      transporter : { host: "smtp.zoho.com", port: 465, secure: true }
    }
  ];
  textTypes: any = [
    { name: "Dark", value: "#000" },
    { name: "Light", value: "#fff" }
  ];
  codExist: boolean; app_setting: any;
  checkout_setting: any; productList: any = [];
  curr_date: any = new Date();
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  btnLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService,
    private api: StoreApiService, private atp: AmazingTimePickerService, private router: Router
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.commonService.loadChat();
    if(this.commonService.payment_list.findIndex(obj => obj.name=='COD') != -1) this.codExist = true;
  }

  // opening hrs
  onOpenStoreOpenDaysModal(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        let appSetting = result.data.application_setting;
        this.settingForm = {
          opening_days: result.data.opening_days, sp_slot_duration: appSetting.sp_slot_duration,
          sp_delay_type: appSetting.sp_delay_type, sp_delay_duration: appSetting.sp_delay_duration
        };
        if(!this.settingForm.sp_slot_duration) this.settingForm.sp_slot_duration = 60;
        if(!this.settingForm.sp_delay_type) this.settingForm.sp_delay_type = 'day';
        if(!this.settingForm.sp_delay_duration) this.settingForm.sp_delay_duration = 1;
        if(!this.settingForm.opening_days.length) {
          this.settingForm.opening_days = [
            { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
            { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
            { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
            { code: 6, day: "Saturday", active: false, opening_hrs: [] }
          ];
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateOpenDays() {
    let sendData = {
      opening_days: this.settingForm.opening_days, "application_setting.sp_slot_duration": this.settingForm.sp_slot_duration,
      "application_setting.sp_delay_type": this.settingForm.sp_delay_type, "application_setting.sp_delay_duration": this.settingForm.sp_delay_duration
    };
    this.api.UPDATE_STORE_PROPERTY_DETAILS(sendData).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // mail configuration
  onOpenMailModal(modalName) {
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.settingForm = result.data.mail_config;
        if(this.settingForm.transporter && this.settingForm.transporter.auth) {
          this.settingForm.username = this.settingForm.transporter.auth.user;
          this.settingForm.password = this.settingForm.transporter.auth.pass;
        }
        this.settingForm.from_name = this.commonService.store_details.name;
        if(this.settingForm.send_from) {
          let splitData = this.settingForm.send_from.split("<");
          this.settingForm.from_name = splitData[0].trim();
        }
        // cc mail
        this.settingForm.cc_mail_list = [];
        if(this.settingForm.cc_mail) {
          this.settingForm.cc_mail.split(',').forEach(obj => {
            obj = obj.trim();
            this.settingForm.cc_mail_list.push({display: obj, value: obj});
          });
        }
        // billing mail
        this.settingForm.billing_mail_list = [];
        if(this.settingForm.billing_mail) {
          this.settingForm.billing_mail.split(',').forEach(obj => {
            obj = obj.trim();
            this.settingForm.billing_mail_list.push({display: obj, value: obj});
          });
        }
        if(this.settingForm.host_type=='roundcube') {
          this.settingForm.mail_domain = this.settingForm.transporter.name;
          this.settingForm.mail_host = this.settingForm.transporter.host;
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateMailConfig() {
    if(this.commonService.store_details?.package_info?.category!='genie') {
      this.settingForm.submit = true;
      let index = this.mailTypes.findIndex(obj => obj.value==this.settingForm.host_type);
      if(index!=-1) {
        this.settingForm.transporter = this.mailTypes[index].transporter;
        this.settingForm.transporter.auth = { user: this.settingForm.username, pass: this.settingForm.password };
        if(this.settingForm.host_type=='roundcube') {
          this.settingForm.transporter.name = this.settingForm.mail_domain;
          this.settingForm.transporter.host = this.settingForm.mail_host;
        }
      }
      else {
        delete this.settingForm.host_type;
        delete this.settingForm.transporter;
      }
      this.settingForm.send_from = this.settingForm.from_name+" <"+this.settingForm.username+">";
      // cc mail
      delete this.settingForm.cc_mail;
      if(this.settingForm.cc_mail_list.length) {
        let mailList = [];
        this.settingForm.cc_mail_list.forEach(obj => {
          mailList.push(obj.value.trim());
        });
        this.settingForm.cc_mail = mailList.join(',');
      }
      // billing mail
      delete this.settingForm.billing_mail;
      if(this.settingForm.billing_mail_list.length) {
        let mailList = [];
        this.settingForm.billing_mail_list.forEach(obj => {
          mailList.push(obj.value.trim());
        });
        this.settingForm.billing_mail = mailList.join(',');
      }
      this.api.STORE_UPDATE({ mail_config: this.settingForm }).subscribe(result => {
        if(result.status) document.getElementById('closeModal').click();
        else {
          this.settingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      // cc mail
      this.settingForm.cc_mail = "";
      if(this.settingForm.cc_mail_list.length) {
        let mailList = [];
        this.settingForm.cc_mail_list.forEach(obj => {
          mailList.push(obj.value.trim());
        });
        this.settingForm.cc_mail = mailList.join(',');
      }
      // billing mail
      this.settingForm.billing_mail = "";
      if(this.settingForm.billing_mail_list.length) {
        let mailList = [];
        this.settingForm.billing_mail_list.forEach(obj => {
          mailList.push(obj.value.trim());
        });
        this.settingForm.billing_mail = mailList.join(',');
      }
      this.api.STORE_UPDATE({ "mail_config.cc_mail": this.settingForm.cc_mail, "mail_config.billing_mail": this.settingForm.billing_mail }).subscribe(result => {
        if(result.status) document.getElementById('closeModal').click();
        else {
          this.settingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // invoice configuration
  onOpenInvoiceModal(modalName) {
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting = { invoice_status: result.data.invoice_status, invoice_config: result.data.invoice_config };
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateInvoiceConfig() {
    this.api.STORE_UPDATE(this.app_setting).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // packaging charges
  onOpenPackChargeModal(modalName) {
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        if(!result.data.packaging_charges) result.data.packaging_charges = {};
        this.app_setting = { packaging_charges: result.data.packaging_charges };
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }
  onUpdatePackCharge() {
    this.api.STORE_UPDATE(this.app_setting).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // setting
  onOpenSettingModal(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting = result.data.application_setting;
        this.checkout_setting = result.data.checkout_setting;
        // search keywords
        this.app_setting.search_keyword_list = [];
        if(this.app_setting.search_keywords.length) {
          this.app_setting.search_keywords.forEach(obj => {
            this.app_setting.search_keyword_list.push({display: obj, value: obj});
          });
        }
        // newsletter
        if(!this.app_setting.newsletter_config) {
          this.app_setting.newsletter_config = {
            heading: "NEWSLETTER", sub_heading: "Subscribe now to get updates on latest trends and offers", btn_text: "SUBSCRIBE"
          }
        }
        if(!this.app_setting.newsletter_config.link_type) this.app_setting.newsletter_config.link_type = 'internal';
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdateStore() {
    if(this.commonService.ys_features.indexOf('customer_feedback')==-1) this.app_setting.feedback = false;
    if(this.commonService.ys_features.indexOf('addons')==-1) this.app_setting.product_addon = false;
    if(this.commonService.ys_features.indexOf('currency_variation')==-1) this.app_setting.hide_currency = false;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ application_setting: this.app_setting }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEnableAdvProdOptions() {
    this.btnLoader = true; let optStatus = true;
    if(this.commonService.store_details?.additional_features?.adv_product_options) optStatus = false;
    this.api.STORE_UPDATE({ "additional_features.adv_product_options": optStatus }).subscribe(result => {
      delete this.btnLoader;
      if(result.status) {
        this.commonService.store_details.additional_features = result.data.additional_features;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
      }
      else console.log("response", result);
    });
  }

  onUpdateCheckout() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ checkout_setting: this.checkout_setting }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.checkout_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateKeywords() {
    let searchKeywords = [];
    if(this.app_setting.search_keyword_list) {
      this.app_setting.search_keyword_list.forEach(obj => {
        searchKeywords.push(obj.value);
      });
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.search_keywords": searchKeywords }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateInvoice() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.invoice_status": this.app_setting.invoice_status, "application_setting.invoice_config": this.app_setting.invoice_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateSocial() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.google_id": this.app_setting.google_id, "application_setting.facebook_id": this.app_setting.facebook_id }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateNewsletter() {
    this.app_setting.submit = true;
    if(!this.app_setting.newsletter_config.subscription_status) this.app_setting.newsletter_config.open_onload = true;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.newsletter_status": this.app_setting.newsletter_status, "application_setting.newsletter_config": this.app_setting.newsletter_config }).subscribe(result => {
      this.app_setting.submit = false;
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateChat() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.chat_status": this.app_setting.chat_status, "application_setting.chat_config": this.app_setting.chat_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Announcement bar
  onOpenAnnounceModal(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting = result.data.application_setting;
        // announcement bar
        if(this.app_setting.announcebar_config && this.app_setting.announcebar_config.timer_date) {
          this.app_setting.announcebar_config.end_date = new Date(this.app_setting.announcebar_config.timer_date);
          this.app_setting.announcebar_config.end_time = new Date(this.app_setting.announcebar_config.timer_date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        // product list
        if(!this.productList.length) {
          this.api.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
            if(result.status) this.productList = result.list;
            else console.log("response", result);
          });
        }
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateAnnounceBar() {
    if(this.app_setting.announcebar_status && this.app_setting.announcebar_config.timer) {
      let timerDate = new Date(this.app_setting.announcebar_config.end_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.app_setting.announcebar_config.end_time;
      this.app_setting.announcebar_config.timer_date = new Date(timerDate);
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.announcebar_status": this.app_setting.announcebar_status, "application_setting.announcebar_config": this.app_setting.announcebar_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  openingHrsTimePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm.opening_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }
  timePicker() {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.app_setting.announcebar_config.end_time = this.commonService.timeConversion(time);
    });
  }

  enableTimer() {
    if(this.app_setting?.announcebar_config?.timer && !this.app_setting?.announcebar_config?.content.includes("TIMER"))
      this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.trim()+" TIMER";
    else if(!this.app_setting?.announcebar_config?.timer) {
      if(this.app_setting?.announcebar_config?.content.includes(" TIMER"))
        this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.replace(" TIMER", "");
      else if(this.app_setting?.announcebar_config?.content.includes("TIMER "))
        this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.replace("TIMER ", "");
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.app_setting.newsletter_config.image = (<FileReader>event.target).result;
        this.app_setting.newsletter_config.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnDestroy() {
    this.commonService.hideChat();
  }

  // createSSL() {
  //   this.btnLoader = true;
  //   this.api.CREATE_SSL().subscribe((result) => {
  //     this.btnLoader = false;
  //     console.log("-----", result);
  //   });
  // }

}