import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  animations: [SharedAnimations]
})

export class PaymentMethodsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	payForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  eventTrigger: any;
  basic_payments: any = ["COD", "Gpay", "Bank Payment"];

	constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService,
    public commonService: CommonService, private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PAYMENT_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else console.log("response", result);
    });
  }

  // ADD
  onOpenAddModal(x, modalName) {
    if(this.commonService.deploy_stages['payments'] || sessionStorage.getItem('policy_agree')) {
      this.payForm = x;
      this.modalService.open(modalName, {size: 'lg'});
    }
    else {
      this.eventTrigger = { type: 'add', value: x, modal: modalName };
      document.getElementById("openInfoModal").click();
    }
  }
	onAdd() {
    if(this.basic_payments.indexOf(this.payForm.name)==-1 && this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id) {
      document.getElementById('closeModal').click();
      document.getElementById("openCommonUpgradeModal").click();
    }
    else {
      if(this.list.findIndex(obj => obj.name==this.payForm.name) == -1) {
        let formData = this.structureFormData();
        formData.rank = this.maxRank+1;
        this.api.ADD_PAYMENT(formData).subscribe(result => {
          this.updateDeployStatus();
          if(result.status) {
            document.getElementById('closeModal').click();
            this.list = result.list;
            this.maxRank = this.list.length;
            this.commonService.payment_list = this.list;
            this.commonService.updateLocalData('payment_list', this.list);
          }
          else {
            this.payForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else {
        this.payForm.errorMsg = "Payment already exist.";
      }
    }
  }

	// EDIT
  onEdit(x, modalName, enableStatus) {
    if(this.commonService.deploy_stages['payments'] || sessionStorage.getItem('policy_agree')) {
      this.payForm = { form_type: 'update', _id: x._id, name: x.name, btn_name: x.btn_name, status: x.status, prev_rank: x.rank, rank: x.rank };
      if(x.cod_config) this.payForm.cod_config = x.cod_config;
      if(x.sms_config) {
        this.payForm.sms_config = {};
        for (let key in x.sms_config) {
          this.payForm.sms_config[key] = x.sms_config[key];
        }
      }
      if(x.mode) this.payForm.mode = x.mode;
      if(x.name=='Razorpay') {
        this.payForm.store_name = x.app_config.name;
        this.payForm.description = x.app_config.description;
        this.payForm.key_id = x.config.key_id;
        this.payForm.key_secret = x.config.key_secret;
      }
      else if(x.name=='CCAvenue') {
        this.payForm.merchant_id = x.config.merchant_id;
        this.payForm.working_key = x.config.working_key;
        this.payForm.ap_access_code = x.additional_params.access_code;
        this.payForm.ap_working_key = x.additional_params.working_key;
        this.payForm.ac_access_code = x.app_config.access_code;
      }
      else if(x.name=='PayPal') {
        this.payForm.client_id = x.config.client_id;
        this.payForm.client_secret = x.config.client_secret;
      }
      else if(x.name=='Square') {
        this.payForm.access_token = x.config.access_token;
        this.payForm.store_name = x.app_config.name;
        this.payForm.app_id = x.app_config.app_id;
        this.payForm.location_id = x.app_config.location_id;
      }
      else if(x.name=='Fatoorah' || x.name=='Flutterwave') {
        this.payForm.token = x.config.token;
      }
      else if(x.name=='Telr') {
        this.payForm.key = x.config.key;
        this.payForm.ivp_store = x.config.ivp_store;
      }
      else if(x.name=='Foloosi') {
        this.payForm.merchant_key = x.config.merchant_key;
        this.payForm.secret_key = x.config.secret_key;
      }
      else if(x.name=='Gpay') {
        this.payForm.upi_id = x.app_config.upi_id;
        this.payForm.merchant_name = x.app_config.merchant_name;
        this.payForm.merchant_code = x.app_config.merchant_code;
        if(enableStatus) this.payForm.status = 'active';
      }
      else if(x.name=='Bank Payment') {
        this.payForm.field_list = x.app_config.field_list;
        this.payForm.message = x.app_config.description;
        this.payForm.pay_id_field_status = x.app_config.pay_id_field_status;
      }
      this.modalService.open(modalName, {size: 'lg'});
      if(enableStatus) {
        setTimeout(() => {
          if(document.getElementById("upi_id")) document.getElementById("upi_id").focus();
        }, 100);
      }
    }
    else {
      this.eventTrigger = { type: 'edit', value: x, modal: modalName };
      document.getElementById("openInfoModal").click();
    }
  }
  onUpdate() {
    let formData = this.structureFormData();
    this.api.UPDATE_PAYMENT(formData).subscribe(result => {
      this.updateDeployStatus();
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
        this.payForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // STATUS
  onChangeStatus(x, modalName, editModal) {
    if(this.commonService.deploy_stages['payments'] || sessionStorage.getItem('policy_agree')) {
      if(x.name=='Gpay' && x.status=='inactive' && !x.app_config?.upi_id) {
        this.onEdit(x, editModal, true);
      }
      else {
        this.payForm = x;
        this.payForm.prev_rank = x.rank;
        this.payForm.prev_status = x.status;
        this.modalService.open(modalName, { centered: true });
      }
    }
    else {
      this.eventTrigger = { type: 'status', value: x, modal: modalName, modal2: editModal };
      document.getElementById("openInfoModal").click();
    }
  }
  onUpdateStatus() {
    if(this.payForm.status=='active') this.payForm.status = 'inactive';
    else this.payForm.status = 'active';
    this.api.UPDATE_PAYMENT(this.payForm).subscribe(result => {
      this.updateDeployStatus();
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
        this.payForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // DELETE
  onOpenDelteModal(x, modalName) {
    if(this.commonService.deploy_stages['payments'] || sessionStorage.getItem('policy_agree')) {
      this.deleteForm = x;
      this.modalService.open(modalName, { centered: true });
    }
    else {
      this.eventTrigger = { type: 'delete', value: x, modal: modalName };
      document.getElementById("openInfoModal").click();
    }
  }
  onDelete() {
    this.api.DELETE_PAYMENT(this.deleteForm).subscribe(result => {
      this.updateDeployStatus();
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
        this.maxRank = this.list.length;
        this.commonService.payment_list = this.list;
        this.commonService.updateLocalData('payment_list', this.list);
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  changeOption(x) {
    if(!this.payForm.cod_config) this.payForm.cod_config = {};
    if(x=='Bank Payment') {
      if(!this.payForm.field_list || !this.payForm.field_list.length) this.payForm.field_list = [{ title: "Account Name", value: "" }, { title: "Account No", value: "" }];
      if(!this.payForm.message) this.payForm.message = "You will receive an order confirmation email as soon as we validate the payment sent by you.";
    }
    else if(x=='Gpay') {
      if(!this.payForm.merchant_name) this.payForm.merchant_name = this.commonService.store_details.name;
      if(!this.payForm.btn_name) this.payForm.btn_name = "Pay With Google Pay";
      if(!this.payForm.merchant_code) {
        let mIndex = this.commonService.store_categories.findIndex(obj => obj.name==this.commonService.deploy_details.category);
        if(mIndex!=-1) this.payForm.merchant_code = this.commonService.store_categories[mIndex].code;
      }
    }
    else {
      if(this.payForm.btn_name=="Pay With Google Pay") this.payForm.btn_name = '';
    }
  }

  structureFormData() {
    let paymentData: any = { name: this.payForm.name, btn_name: this.payForm.btn_name, status: this.payForm.status, supported_currrencies: [] };
    if(this.payForm.cod_config) paymentData.cod_config = this.payForm.cod_config;
    if(this.payForm.sms_config) paymentData.sms_config = this.payForm.sms_config;
    if(this.payForm.form_type=='update') {
      paymentData._id = this.payForm._id;
      paymentData.rank = this.payForm.rank;
      paymentData.prev_rank = this.payForm.prev_rank;
    }
    if(paymentData.name=='Razorpay') {
      paymentData.config = { key_id: this.payForm.key_id, key_secret: this.payForm.key_secret };
      paymentData.app_config = { name: this.payForm.store_name, description: this.payForm.description, key: this.payForm.key_id };
    }
    else if(paymentData.name=='CCAvenue') {
      paymentData.config = { merchant_id: this.payForm.merchant_id, working_key: this.payForm.working_key };
      paymentData.additional_params = { access_code: this.payForm.ap_access_code, working_key: this.payForm.ap_working_key };
      paymentData.app_config = { access_code: this.payForm.ac_access_code };
    }
    else if(paymentData.name=='PayPal') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { client_id: this.payForm.client_id, client_secret: this.payForm.client_secret };
      paymentData.supported_currrencies = [ "AUD", "CHF", "EUR", "GBP", "HKD", "JPY", "MYR", "SGD", "USD" ];
    }
    else if(paymentData.name=='Square') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { access_token: this.payForm.access_token };
      paymentData.app_config = { name: this.payForm.store_name, app_id: this.payForm.app_id, location_id: this.payForm.location_id };
    }
    else if(paymentData.name=='Fatoorah' || paymentData.name=='Flutterwave') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { token: this.payForm.token };
    }
    else if(paymentData.name=='Telr') {
      paymentData.mode = this.payForm.mode;
      paymentData.config = { key: this.payForm.key, ivp_store: this.payForm.ivp_store };
    }
    else if(paymentData.name=='Foloosi') {
      paymentData.config = { merchant_key: this.payForm.merchant_key, secret_key: this.payForm.secret_key };
      paymentData.app_config = { merchant_key: this.payForm.merchant_key };
    }
    else if(paymentData.name=='Gpay') {
      paymentData.app_config = { upi_id: this.payForm.upi_id, merchant_name: this.payForm.merchant_name, merchant_code: this.payForm.merchant_code };
    }
    else if(paymentData.name=='Bank Payment') {
      paymentData.app_config = { field_list: this.payForm.field_list, description: this.payForm.message, pay_id_field_status: this.payForm.pay_id_field_status };
    }
    return paymentData;
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['payments']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.payments": true };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  onAgree() {
    sessionStorage.setItem("policy_agree", "1");
    if(this.eventTrigger?.type=='add') {
      this.onOpenAddModal(this.eventTrigger.value, this.eventTrigger.modal);
    }
    else if(this.eventTrigger?.type=='edit') {
      this.onEdit(this.eventTrigger.value, this.eventTrigger.modal, false);
    }
    else if(this.eventTrigger?.type=='delete') {
      this.onOpenDelteModal(this.eventTrigger.value, this.eventTrigger.modal);
    }
    else if(this.eventTrigger?.type=='status') {
      this.onChangeStatus(this.eventTrigger.value, this.eventTrigger.modal, this.eventTrigger.modal2);
    }
  }

}