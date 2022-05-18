import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  pageLoader: boolean; customerDetails: any = {}; params: any = {};
  imgBaseUrl = environment.img_baseurl; addressFormType: string;
  editForm: any = {}; addressForm: any = {}; customerForm: any = {};
  country_details: any; address_fields: any = []; mobile_pattern: any;
  state_list: any = []; deleteForm: any = {};
  selected_address: any; selected_model: any; btnLoader: boolean;

  custom_list: any = []; addonForm: any = {};
  customIndex: number; mmIndex: number = 0;
  selected_unit: any = {}; parent_mm_list: any = [];
  configData: any= environment.config_data;
  measurementList: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private router: Router,
    public commonService: CommonService, private customerApi: CustomerApiService, private prodExtApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.customerApi.CUSTOMER_DETAILS(params.id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) this.customerDetails = result.data;
        else console.log("response", result);
      });
    });
  }

  goOrdersPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/orders/product/"+type+"/"+customer._id])
  }

  goQuotPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/quotations/"+type+"/"+customer._id])
  }

  // EDIT CUSTOMER
  onEditCustomer(x, modalName) {
    this.btnLoader = false;
    this.editForm = { _id: x._id, name: x.name, email: x.email, dial_code: x.dial_code, mobile: x.mobile };
    this.modalService.open(modalName);
  }
  onUpdateCustomer() {
    this.btnLoader = true;
    this.customerApi.UPDATE_CUSTOMER(this.editForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // ADD ADDRESS
  onAddAddressModal(modalName) {
    this.btnLoader = false;
    this.addressFormType = 'add';
    this.addressForm = { type: 'home', country: this.commonService.store_details.country };
    if(!this.customerDetails.address_list.length) {
      this.addressForm.billing_address = true;
      this.addressForm.shipping_address = true;
    }
    this.onEditCountryChange(this.addressForm.country);
    this.modalService.open(modalName, {size: 'lg'});
  }

  // EDIT ADDRESS
  onEditAddress(x, modalName) {
    this.btnLoader = false;
    this.addressFormType = "update";
    this.onEditCountryChange(x.country);
    this.addressForm = { exist_billing: x.billing_address, exist_shipping: x.shipping_address };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.addressForm[key] = x[key];
    }
    this.address_fields.forEach(element => {
      element.value = this.addressForm[element.keyword];
    });
    this.modalService.open(modalName, {size: 'lg'});
  }

  onAddressEvent() {
    this.btnLoader = true;
    this.addressForm.customer_id = this.params.id;
    this.address_fields.forEach(element => {
      if(element.value) this.addressForm[element.keyword] = element.value;
    });
    if(this.addressFormType=='add') {
      this.customerApi.ADD_ADDRESS(this.addressForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          document.getElementById("closeModal").click();
          this.customerDetails = result.data;
        }
        else {
          this.addressForm.error_msg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.customerApi.UPDATE_ADDRESS(this.addressForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          document.getElementById("closeModal").click();
          this.customerDetails = result.data;
        }
        else {
          this.addressForm.error_msg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE ADDRESS
  onDeleteAddress() {
    this.deleteForm = this.selected_address;
    this.deleteForm.customer_id = this.params.id;
    this.customerApi.DELETE_ADDRESS(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById("closeModal").click();
        this.customerDetails = result.data;
      }
      else {
        this.deleteForm.error_msg = result.message;
        console.log("response", result);
      }
    });
  }

  // DELETE MODEL
  onDeleteModel() {
    this.deleteForm = this.selected_model;
    this.deleteForm.customer_id = this.params.id;
    this.customerApi.DELETE_MODEL(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById("closeModal").click();
        this.customerDetails = result.data;
      }
      else {
        this.deleteForm.error_msg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = []; this.address_fields = [];
    delete this.country_details; delete this.mobile_pattern;
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.commonService.country_list[index];
      this.state_list = this.country_details.states;
      this.customerForm.address_form.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
      if(this.country_details.mobileno_length) this.mobile_pattern = ".{"+this.country_details.mobileno_length+","+this.country_details.mobileno_length+"}";
    }
  }
  onEditCountryChange(x) {
    this.state_list = []; this.address_fields = [];
    delete this.country_details; delete this.mobile_pattern;
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.country_details = this.commonService.country_list[index];
      this.state_list = this.country_details.states;
      this.addressForm.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
      if(this.country_details.mobileno_length) this.mobile_pattern = ".{"+this.country_details.mobileno_length+","+this.country_details.mobileno_length+"}";
    }
  }

  onViewModelHistory(x) {
    let customerDetails = { name: this.customerDetails.name, email: this.customerDetails.email, unique_id: this.customerDetails.unique_id };
    sessionStorage.setItem("customer_details", JSON.stringify(customerDetails));
    this.router.navigate(["/customers/"+this.params.id+"/"+x._id]);
  }

  // customer models
  onEdit(type, modelId, modalName) {
    this.customerApi.CUSTOMER_DETAILS(this.params.id).subscribe(result => {
      if(result.status) {
        let modelList = result.data.model_list;
        let index = modelList.findIndex(obj => obj._id==modelId);
        if(index!=-1) {
          this.addonForm = modelList[index];
          this.prodExtApi.ADDON_DETAILS(this.addonForm.addon_id).subscribe(result => {
            if(result.status) {
              let addonDetails = result.data;
              this.addonForm.price = addonDetails.price;
              // customization
              if(type=="custom") {
                this.customIndex = 0;
                this.custom_list = addonDetails.custom_list;
                this.custom_list[this.customIndex].filtered_option_list = this.custom_list[this.customIndex].option_list;
                let customList = this.addonForm.custom_list[this.customIndex];
                if(this.custom_list[this.customIndex].type=='either_or') {
                  if(customList.value && customList.value.length) {
                    let selectedOption = customList.value[0];
                    let optIndex = this.custom_list[this.customIndex].filtered_option_list.findIndex(obj => obj.name==selectedOption.name);
                    if(optIndex!=-1) {
                      this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[optIndex].name;
                      this.getRadioNextList(this.custom_list[this.customIndex].selected_option);
                    }
                  }
                  else {
                    this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
                    this.getRadioNextList(this.custom_list[this.customIndex].selected_option);
                  }
                }
                else {
                  if(customList.value) {
                    this.custom_list[this.customIndex].filtered_option_list.forEach(opt => {
                      let optionIndex = customList.value.findIndex(obj => obj.name==opt.name);
                      if(optionIndex!=-1) opt.custom_option_checked = true;
                    });
                    this.getCheckboxNextList();
                  }
                  this.disableOption();
                }
                this.modalService.open(modalName, {size: 'lg'});
                this.commonService.scrollModalTop(500);
              }
              // measurement
              else if(type=="measurement") {
                this.mmIndex = 0;
                if(!this.measurementList) {
                  this.prodExtApi.MEASUREMENT_LIST().subscribe(result => {
                    if(result.status) this.measurementList = result.list;
                    else this.measurementList = [];
                    this.buildMmList(addonDetails.mm_list, this.measurementList).then((resp: any) => {
                      this.parent_mm_list = resp;
                      this.updateCurrentMmList();
                      this.modalService.open(modalName, {size: 'lg'});
                      this.commonService.scrollModalTop(500);
                    });
                  });
                }
                else {
                  this.buildMmList(addonDetails.mm_list, this.measurementList).then((resp: any) => {
                    this.parent_mm_list = resp;
                    this.updateCurrentMmList();
                    this.modalService.open(modalName, {size: 'lg'});
                    this.commonService.scrollModalTop(500);
                  });
                }
              }
              else {
                this.modalService.open(modalName, {size: 'lg'});
                this.commonService.scrollModalTop(500);
              }
            }
            else console.log("response", result);
          });
        }
        else console.log("invalid model");
      }
      else console.log("response", result);
    });
  }

  onUpdateCustom() {
    let reqInput = this.validateForm('custom-form');
    if(reqInput===undefined) {
      let customAlert = this.checkCustomSelection();
      if(!customAlert) {
        this.addonForm.submit = true;
        this.addonForm.custom_list = [];
        this.custom_list.forEach(obj => {
          if(obj.filtered_option_list) {
            if(obj.type=="either_or") {
              let selIndex = obj.filtered_option_list.findIndex(opt => opt.name==obj.selected_option);
              if(selIndex!=-1) this.addonForm.custom_list.push({ name: obj.name, value: [obj.filtered_option_list[selIndex]] });
            }
            else {
              let selectedList = obj.filtered_option_list.filter(opt => opt.custom_option_checked);
              if(selectedList.length) this.addonForm.custom_list.push({ name: obj.name, value: selectedList })
            }
          }
        });
        this.addonForm.customer_id = this.params.id;
        this.onUpdateModel(this.addonForm, 'customization');
      }
      else this.addonForm.alert_msg = customAlert;
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }

  onUpdateMeasurement() {
    let reqInput = this.validateForm('mm-form');
    if(reqInput===undefined) {
      // for find additional qty
      for(let elem of this.addonForm.mm_sets[this.mmIndex].list) {
        elem.additional_qty = 0;
        if(elem.conditions && elem.conditions.length) {
          for(let cond of elem.conditions) {
            let filteredList = cond.list.filter(obj => obj.unit==this.addonForm.mm_unit);
            if(filteredList.length) {
              elem.additional_qty = filteredList[0].additional_qty;
              if(parseFloat(elem.value)>filteredList[0].mm_from && filteredList[0].mm_to>=parseFloat(elem.value)) {
                elem.additional_qty = filteredList[0].additional_qty;
                break;
              }
            }
          }
        }
      }
      this.addonForm.submit = true;
      this.addonForm.customer_id = this.params.id;
      this.onUpdateModel(this.addonForm, 'measurement');
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }

  onUpdateNotes() {
    let reqInput = this.validateForm('notes-form');
    if(reqInput===undefined) {
      this.addonForm.submit = true;
      this.addonForm.customer_id = this.params.id;
      this.onUpdateModel(this.addonForm, 'notes');
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }

  onUpdateModel(addonForm, type) {
    this.customerApi.UPDATE_MODEL(addonForm).subscribe(result => {
      this.addonForm.submit = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.customerDetails = result.data;
        // model history
        if(this.commonService.ys_features.indexOf('custom_model_history')!=-1) {
          addonForm.store_id = this.commonService.store_details._id;
          addonForm.customer_id = this.params.id;
          addonForm.model_id = addonForm._id;
          if(type=='customization') {
            addonForm.mm_sets = [];
            addonForm.notes_list = [];
            delete addonForm.mm_unit;
          }
          else if(type=='measurement') {
            addonForm.custom_list = [];
            addonForm.notes_list = [];
          }
          else if(type=='notes') {
            addonForm.custom_list = [];
            addonForm.mm_sets = [];
            delete addonForm.mm_unit;
          }
          delete addonForm._id; delete addonForm.created_on;
          this.customerApi.ADD_MODEL_TO_CUSTOMER_HISTORY(addonForm).subscribe(result => { });
        }
      }
      else {
        console.log("response", result);
        this.addonForm.alert_msg = result.message;
      }
    });
  }

  // custom section
  getRadioNextList(optionName) {
    // if next option list exist
    if(this.custom_list[this.customIndex+1]) {
      this.custom_list[this.customIndex+1].filtered_option_list = this.custom_list[this.customIndex+1].option_list.filter(obj => obj.link_to=='all' || obj.link_to==optionName);
    }
  }
  getCheckboxNextList() {
    // if next option list exist
    if(this.custom_list[this.customIndex+1])
    {
      let selectedItems = [];
      this.custom_list[this.customIndex].filtered_option_list.forEach(obj => {
        if(obj.custom_option_checked) selectedItems.push(obj.name);
      });
      this.custom_list[this.customIndex+1].filtered_option_list = this.custom_list[this.customIndex+1].option_list.filter(obj => obj.link_to=='all' || selectedItems.indexOf(obj.link_to)!=-1);
    }
  }
  disableOption() {
    // for mandatory or limited options
    if(this.custom_list[this.customIndex].limit > 0) {
      // for disable unchecked checkbox
      let checkedLen = this.custom_list[this.customIndex].filtered_option_list.filter(obj => obj.custom_option_checked).length;
      if(this.custom_list[this.customIndex].limit==checkedLen) {
        this.custom_list[this.customIndex].filtered_option_list.forEach(obj => {
          obj.disabled = true;
          if(obj.custom_option_checked) obj.disabled = false;
        });
      }
      else this.custom_list[this.customIndex].filtered_option_list.forEach(obj => { obj.disabled = false; });
    }
  }
  onCustomNext() {
    let reqInput = this.validateForm('custom-form');
    if(reqInput===undefined) {
      let customAlert = this.checkCustomSelection();
      if(!customAlert) {
        this.customIndex = this.customIndex+1;
        if(this.custom_list[this.customIndex].type=='either_or') {
          if(this.custom_list[this.customIndex].selected_option) {
            if(this.custom_list[this.customIndex].filtered_option_list.findIndex(obj => obj.name==this.custom_list[this.customIndex].selected_option) == -1) {
              this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
            }
          }
          else {
            this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
            let customList = this.addonForm.custom_list[this.customIndex];
            if(customList && customList.value && customList.value.length) {
              let selectedOption = customList.value[0];
              let optIndex = this.custom_list[this.customIndex].filtered_option_list.findIndex(obj => obj.name==selectedOption.name);
              if(optIndex!=-1) {
                this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[optIndex].name;
              }
            }
          }
          this.getRadioNextList(this.custom_list[this.customIndex].selected_option);
        }
        else {
          this.disableOption();
          if(this.addonForm.custom_list[this.customIndex]) {
            this.custom_list[this.customIndex].filtered_option_list.forEach(opt => {
              let optionIndex = this.addonForm.custom_list[this.customIndex].value.findIndex(obj => obj.name==opt.name);
              if(optionIndex!=-1) opt.custom_option_checked = true;
            });
            this.getCheckboxNextList();
          }
        }
        this.commonService.scrollModalTop(0);
      }
      else this.addonForm.alert_msg = customAlert;
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }

  // measurement section
  buildMmList(mmList, overallmmList) {
    return new Promise((resolve, reject) => {
      let mmSetArray = [];
      mmList.forEach(obj => {
        let mmIndex = overallmmList.findIndex(elem => elem._id==obj.mmset_id);
        if(mmIndex!=-1) mmSetArray.push(overallmmList[mmIndex]);
      });
      resolve(mmSetArray);
    });
  }
  updateCurrentMmList() {
    let parentMmIndex = this.parent_mm_list.findIndex(obj => obj.name==this.addonForm.mm_sets[this.mmIndex].name);
    if(parentMmIndex!=-1) {
      let selectedMmSet = this.parent_mm_list[parentMmIndex];
      // units
      this.addonForm.mm_sets[this.mmIndex].units = selectedMmSet.units;
      let unitIndex = this.addonForm.mm_sets[this.mmIndex].units.findIndex(obj => obj.name==this.addonForm.mm_unit);
      if(unitIndex!=-1) {
        this.selected_unit = this.addonForm.mm_sets[this.mmIndex].units[unitIndex];
        this.addonForm.mm_unit = this.selected_unit.name;
      }
      else {
        this.addonForm.mm_sets[this.mmIndex].units = [{ max_value: 0, name: this.addonForm.mm_unit }];
        this.selected_unit = this.addonForm.mm_sets[this.mmIndex].units[0];
      }
      // list
      for(let list of this.addonForm.mm_sets[this.mmIndex].list) {
        let listIndex = selectedMmSet.list.findIndex(obj => obj.name==list.name);
        if(listIndex!=-1) list.conditions = selectedMmSet.list[listIndex].conditions;
      }
    }
    else {
      this.addonForm.mm_sets[this.mmIndex].units = [{ max_value: 0, name: this.addonForm.mm_unit }];
      this.selected_unit = this.addonForm.mm_sets[this.mmIndex].units[0];
    }
  }
  onChangeUnit() {
    let unitIndex = this.addonForm.mm_sets[this.mmIndex].units.findIndex(obj => obj.name==this.addonForm.mm_unit);
    if(unitIndex!=-1) this.selected_unit = this.addonForm.mm_sets[this.mmIndex].units[unitIndex];
    if(this.addonForm.mm_unit=='cms') {
      // convert inch -> cm
      this.addonForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if(element.value) {
            element.value = element.value*2.54;
            if((element.value % 1) != 0) element.value = parseFloat(element.value.toFixed(1));
          }
        });
      });
    }
    else {
      // convert cm -> inch
      this.addonForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if(element.value) {
            element.value = element.value*0.393701;
            if((element.value % 1) != 0) element.value = parseFloat(element.value.toFixed(1));
          }
        });
      });
    }
  }
  onMmNext() {
    let reqInput = this.validateForm('mm-form');
    if(reqInput===undefined) {
      // for find additional qty
      for(let elem of this.addonForm.mm_sets[this.mmIndex].list) {
        elem.additional_qty = 0;
        if(elem.conditions && elem.conditions.length) {
          for(let cond of elem.conditions) {
            let filteredList = cond.list.filter(obj => obj.unit==this.addonForm.mm_unit);
            if(filteredList.length) {
              elem.additional_qty = filteredList[0].additional_qty;
              if(parseFloat(elem.value)>filteredList[0].mm_from && filteredList[0].mm_to>=parseFloat(elem.value)) {
                elem.additional_qty = filteredList[0].additional_qty;
                break;
              }
            }
          }
        }
      }
      this.mmIndex = this.mmIndex+1;
      this.updateCurrentMmList();
      this.commonService.scrollModalTop(0);
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }
  mmFocusOut(x) {
    if(x.value && x.value==0) {
      x.value=''; x.alert_msg = "Value must be greater than 0"; 
    }
    else if(this.selected_unit.max_value>0 && x.value>this.selected_unit.max_value) {
      x.value=''; x.alert_msg = "Value must be less than or equal to "+this.selected_unit.max_value;
    }
  }

  // common
  validateForm(formType) {
    let form: any = document.getElementById(formType);
    for(let elem of form.elements) {
      if(elem.value === '' && elem.hasAttribute('required')) return elem.id;
    }
  }
  checkCustomSelection() {
    let checkedLen = this.custom_list[this.customIndex].filtered_option_list.filter(obj => obj.custom_option_checked).length;
    if(this.custom_list[this.customIndex].type=='mandatory') {
      if(this.custom_list[this.customIndex].limit==checkedLen) return null;
      else return "Must choose "+this.custom_list[this.customIndex].limit+" options";
    }
    else if(this.custom_list[this.customIndex].type=='limited') {
      if(this.custom_list[this.customIndex].limit >= checkedLen) return null;
      else return "Choose maximum "+this.custom_list[this.customIndex].limit+" options";
    }
    else return null;
  }

}
