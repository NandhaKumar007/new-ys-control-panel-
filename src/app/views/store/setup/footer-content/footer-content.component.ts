import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-footer-content',
  templateUrl: './footer-content.component.html',
  styleUrls: ['./footer-content.component.scss']
})

export class FooterContentComponent implements OnInit {

  pageLoader: boolean;
  footer_config: any = {};
  editForm: any;
  paymentTypes: any = ["amex", "maestro", "mastercard", "paypal", "paytm", "upi", "visa"];

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.footer_config = result.data.footer_config;
      else console.log("response", result);
    });
  }

  // address & contact
  onEditDetails(type, modalName) {
    if(type=='address') this.editForm = { type: type, title: this.footer_config.address_config.title, content: this.footer_config.address_config.content };
    else this.editForm = { type: type, title: this.footer_config.contact_config.title, content: this.footer_config.contact_config.content }
    this.modalService.open(modalName, {size: 'lg'});
  }
  onUpdateDetails() {
    let sendData = {};
    if(this.editForm.type=='address') sendData = { "footer_config.address_config": this.editForm };
    else sendData = { "footer_config.contact_config": this.editForm };
    this.api.UPDATE_STORE_PROPERTY_DETAILS(sendData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // social media
  onEditSocialMedia(modalName) {
    let smLink = [];
    this.footer_config.social_media_links.forEach(obj => {
      smLink.push({ type: obj.type, url: obj.url });
    });
    this.editForm = { social_media_title: this.footer_config.social_media_title, social_media_links: smLink };
    this.modalService.open(modalName, {size: 'lg'});
  }
  onUpdateSocialMedia() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "footer_config.social_media_title": this.editForm.social_media_title, "footer_config.social_media_links": this.editForm.social_media_links }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // payment methods
  onEditPayment(modalName) {
    this.editForm = { payment_methods: [] };
    this.footer_config.payment_methods.forEach(obj => {
      this.editForm.payment_methods.push({ type: obj });
    });
    this.modalService.open(modalName, {size: 'lg'});
  }
  onUpdatePayment() {
    let paymentTypes = [];
    this.editForm.payment_methods.forEach(obj => { paymentTypes.push(obj.type); });
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "footer_config.payment_methods": paymentTypes }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // footer links
  onEditFooterLink(modalName) {
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.editForm = result.data.footer_config;
        if(!this.editForm.other_links.length) this.editForm.other_links = [{ link_type: 'internal' }];
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }
  onUpdateFooterLink() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "footer_config.other_links": this.editForm.other_links }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.footer_config = result.data.footer_config;
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}