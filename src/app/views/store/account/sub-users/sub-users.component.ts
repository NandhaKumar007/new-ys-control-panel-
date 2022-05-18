import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-sub-users',
  templateUrl: './sub-users.component.html',
  styleUrls: ['./sub-users.component.scss'],
  animations: [SharedAnimations]
})

export class SubUsersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean;
  list: any = []; btnLoader: boolean;
  addForm: any = {}; editForm: any = {}; deleteForm: any = {};
  pwdForm: any = {}; permForm: any = {};
  permissionList: any = [];
  subUserLimit: Number = 0;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
    this.createPermList();
  }

  ngOnInit() {
    if(this.commonService.ys_features.indexOf('1_staff')!=-1) this.subUserLimit = 1;
    if(this.commonService.ys_features.indexOf('5_staff')!=-1) this.subUserLimit = 5;
    if(this.commonService.ys_features.indexOf('10_staff')!=-1) this.subUserLimit = 10;
    if(this.commonService.ys_features.indexOf('20_staff')!=-1) this.subUserLimit = 20;
    if(this.commonService.ys_features.indexOf('20_plus_staff')!=-1) this.subUserLimit = 100;
    this.pageLoader = true;
    this.api.SUBUSER_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
  onAdd() {
    this.btnLoader = true;
    this.addForm.max_limit = this.subUserLimit;
    this.api.ADD_SUBUSER(this.addForm).subscribe((result) => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
      else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
    });
  }

  // EDIT
  onEdit(x, type, modalName) {
    this.api.SUBUSER_LIST().subscribe(result => {
      if(result.status) {
        let userList = result.list;
        let index = userList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = userList[index];
          this.editForm.exist_status = this.editForm.status;
          if(type=='details') this.modalService.open(modalName);
          else {
            // permission list
            this.editForm.perm_status = true;
            this.updatePermList(this.editForm.permission_list);
            this.modalService.open(modalName, {size: "lg"});
          }
        }
        else console.log("invalid user");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
  onUpdate() {
    this.editForm.permission_list = this.createUserAccess();
    if(this.editForm.user_status) {
      if(this.editForm.status=='active') {
        this.editForm.session_key = new Date().valueOf();
        this.editForm.status = 'inactive';
      }
      else this.editForm.status = 'active';
    }
    if(this.editForm.perm_status) this.editForm.session_key = new Date().valueOf();
    this.api.UPDATE_SUBUSER(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_SUBUSER(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // UPDATE PWD
  onUpdatePwd() {
    this.api.UPDATE_SUBUSER_PWD(this.pwdForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  createPermList() {
    let ysFeatures = this.commonService.ys_features;
    this.permissionList = [];
    // dashboard
    this.permissionList.push({ title: "DASHBOARD", sub_list: [{ keyword: "dashboard", name: "Analytics" }] });
    // products
    let productExtras = [
      { keyword: "catalogs", name: "Catalog Management" },
      { keyword: "products", name: "All Products" }
    ];
    if(ysFeatures.indexOf('measurements')!=-1) productExtras.push({ keyword: "measurements", name: "Measurement Sets" });
    if(ysFeatures.indexOf('addons')!=-1) productExtras.push({ keyword: "addons", name: "Addons" });
    if(ysFeatures.indexOf('product_filters')!=-1) productExtras.push({ keyword: "product_filters", name: "Tags" });
    if(ysFeatures.indexOf('foot_note')!=-1) productExtras.push({ keyword: "foot_note", name: "Foot Note" });
    if(ysFeatures.indexOf('size_chart')!=-1) productExtras.push({ keyword: "size_chart", name: "Size Chart" });
    if(ysFeatures.indexOf('faq')!=-1) productExtras.push({ keyword: "faq", name: "FAQ" });
    productExtras.push({ keyword: "product_taxonomy", name: "Product Taxonomy" });
    if(ysFeatures.indexOf('product_archive')!=-1) productExtras.push({ keyword: "product_archive", name: "Archived Products" });
    if(ysFeatures.indexOf('product_reviews')!=-1) productExtras.push({ keyword: "product_reviews", name: "Product Reviews" });
    this.permissionList.push({ title: "PRODUCTS", sub_list: productExtras });
    // orders
    let orderList = [
      { keyword: "live_orders", name: "Live Orders" },
      { keyword: "completed_orders", name: "Completed Orders" },
      { keyword: "cancelled_orders", name: "Cancelled Orders" },
      { keyword: "quick_order", name: "Quick Orders" }
    ];
    if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
      orderList.push({ keyword: "giftcard_orders", name: "Giftcard Orders" });
    }
    orderList.push({ keyword: "inactive_orders", name: "Failed Product Payments" });
    if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) orderList.push({ keyword: "inactive_giftcard_orders", name: "Failed Giftcard Payments" });
    if(ysFeatures.indexOf('abandoned_cart')!=-1 && this.commonService.store_details.type!='restaurant_based')
      orderList.push({ keyword: "abandoned_cart", name: "Abandoned Cart" });
    orderList.push({ keyword: "customers", name: "Customers" });
    if(ysFeatures.indexOf('appointment_scheduler')!=-1) orderList.push({ keyword: "appointment_scheduler", name: "Appointments" });
    this.permissionList.push({ title: "ORDERS", sub_list: orderList });
    // marketing tools
    let toolList = [];
    if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) toolList.push({ keyword: "offers", name: "Offers" });
    if(ysFeatures.indexOf('giftcard')!=-1) toolList.push({ keyword: "giftcard", name: "Gift Cards" });
    if(ysFeatures.indexOf('newsletter')!=-1) toolList.push({ keyword: "newsletter", name: "Newsletter" });
    if(ysFeatures.indexOf('customer_feedback')!=-1) toolList.push({ keyword: "customer_feedback", name: "Feedback" });
    if(toolList.length) this.permissionList.push({ title: "MARKETING TOOLS", sub_list: toolList });
    // website
    let webList = [{ keyword: "website_design", name: "Website Design" }];
    if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) webList.push({ keyword: "menu", name: "Menu" });
    webList.push(
      { keyword: "policies", name: "Policies" },
      { keyword: "seo", name: "SEO" },
      { keyword: "contact_page", name: "Contact Page" }
    );
    if(ysFeatures.indexOf('store_locator')!=-1) webList.push({ keyword: "store_locator", name: "Store Locator" });
    if(ysFeatures.indexOf('extra_pages')!=-1) webList.push({ keyword: "extra_pages", name: "Extra Pages" });
    webList.push({ keyword: "footer_configuration", name: "Footer Configuration" });
    this.permissionList.push({ title: "WEBSITE", sub_list: webList });
    // store modules
    let moduleList = [];
    if(ysFeatures.indexOf('shopping_assistant')!=-1) moduleList.push({ keyword: "shopping_assistant", name: "Shopping Assistant" });
    if(ysFeatures.indexOf('sizing_assistant')!=-1) moduleList.push({ keyword: "sizing_assistant", name: "Sizing Assistant" });
    if(ysFeatures.indexOf('currency_variation')!=-1) moduleList.push({ keyword: "currency_variation", name: "Currency Convertor" });
    if(ysFeatures.indexOf('blogs')!=-1) moduleList.push({ keyword: "blogs", name: "Blogs" });
    if(ysFeatures.indexOf('discounts_page')!=-1) moduleList.push({ keyword: "discounts_page", name: "Discounts Page" });
    if(ysFeatures.indexOf('collections')!=-1) moduleList.push({ keyword: "collections", name: "Collections" });
    if(ysFeatures.indexOf('appointment_scheduler')!=-1) moduleList.push({ keyword: "appointment_scheduler", name: "Appointment Services" });
    if(moduleList.length) this.permissionList.push({ title: "STORE MODULES", sub_list: moduleList });
    // setting
    let settingList = [];
    if(ysFeatures.indexOf('tax_rates')!=-1) settingList.push({ keyword: "tax_rates", name: "Tax Rates" });
    if(ysFeatures.indexOf('time_based_delivery')!=-1) settingList.push({ keyword: "delivery_methods", name: "Delivery Methods" });
    else settingList.push({ keyword: "shipping_methods", name: "Shipping Methods" });
    if(ysFeatures.indexOf('pincode_service')!=-1) settingList.push({ keyword: "pincodes", name: "Pincode Service" });
    settingList.push({ keyword: "payment_gateway", name: "Payment Gateway" });
    settingList.push({ keyword: "store_setting", name: "Store Settings" });
    this.permissionList.push({ title: "SETTINGS", sub_list: settingList });
    // my account
    let accList = [{ keyword: "branches", name: "Branches" }];
    if(ysFeatures.indexOf('vendors')!=-1) accList.push({ keyword: "vendors", name: "Vendors" });
    this.permissionList.push({ title: "MY ACCOUNT", sub_list: accList });
    // others
    let othersList = [];
    if(ysFeatures.indexOf('manual_order')!=-1) othersList.push({ keyword: "manual_order", name: "Create Manual Order" });
    if(ysFeatures.indexOf('manual_giftcard')!=-1) othersList.push({ keyword: "manual_giftcard", name: "Create Manual Giftcard" });
    othersList.push(
      { keyword: "product_export", name: "Product Export" },
      { keyword: "order_export", name: "Order Export" }
    );
    this.permissionList.push({ title: "OTHERS", sub_list: othersList });
  }

  updatePermList(userPermList) {
    this.permissionList.forEach(elem => {
      if(elem.sub_list.length) {
        elem.sub_list.forEach(obj => {
          obj.checked = false;
          if(userPermList.indexOf(obj.keyword)!=-1) obj.checked = true;
        });
      }
      else {
        elem.checked = false;
        if(userPermList.indexOf(elem.keyword)!=-1) elem.checked = true;
      }
    });
  }

  createUserAccess() {
    let permList = [];
    this.permissionList.forEach(elem => {
      if(elem.sub_list.length) {
        elem.sub_list.forEach(obj => {
          if(obj.checked) permList.push(obj.keyword);
        });
      }
      else {
        if(elem.checked) permList.push(elem.keyword);
      }
    });
    return permList;
  }

}