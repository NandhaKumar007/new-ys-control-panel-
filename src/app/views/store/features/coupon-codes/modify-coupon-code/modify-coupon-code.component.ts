import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { FeaturesApiService } from '../../features-api.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-modify-coupon-code',
  templateUrl: './modify-coupon-code.component.html',
  styleUrls: ['./modify-coupon-code.component.scss'],
  providers: [AmazingTimePickerService]
})

export class ModifyCouponCodeComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; productListLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl; offerForm: any;
  productList: any = []; allProductList: any = [];
  tempCategoryList: any = []; tempProductList: any = [];
  category_id: any; formType: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private atp: AmazingTimePickerService, private api: FeaturesApiService,
    private router: Router, private activeRoute: ActivatedRoute, private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.activeRoute.params.subscribe((params: Params) => {
      if(params.offer_id) {
        this.formType = "edit";
        this.api.OFFER_DETAILS(params.offer_id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.offerForm = result.data;
            this.tempCategoryList = this.offerForm.category_list;
            this.tempProductList = this.offerForm.product_list;
            this.offerForm.start_date = new Date(this.offerForm.valid_from);
            this.offerForm.start_time = new Date(this.offerForm.valid_from).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if(this.offerForm.valid_to) {
              this.offerForm.enable_end_date = true;
              this.offerForm.end_date = new Date(this.offerForm.valid_to);
              this.offerForm.end_time = new Date(this.offerForm.valid_to).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
            if(this.offerForm.buy_x_get_y_usage_limit) this.offerForm.buy_x_get_y_usage_status = true;
          }
          else console.log("response", result);
        });
      }
      else {
        this.formType = "add";
        this.offerForm = {
          discount_type: 'percentage', apply_to: 'order', min_order_amt: 0, min_order_qty: 0,
          category_list: [], product_list: [], enable_status: true, code_type: 'discount'
        };
        setTimeout(() => { this.pageLoader = false; }, 500);
      }
    });
  }

  onSubmit() {
    this.offerForm.valid_from = new Date(new Date(this.offerForm.start_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.offerForm.start_time);
    this.offerForm.valid_to = null;
    if(this.offerForm.enable_end_date) {
      this.offerForm.valid_to = new Date(new Date(this.offerForm.end_date).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+this.offerForm.end_time);
    }
    if(this.offerForm.discount_type!='buy_x_get_y') {
      delete this.offerForm.buy_properties;
      delete this.offerForm.get_properties;
    }
    if(this.formType=='add') {
      this.api.ADD_OFFER(this.offerForm).subscribe(result => {
        if(result.status) this.router.navigate(['/features/coupon-codes']);
        else {
          console.log("response", result);
          this.offerForm.errorMsg = result.message;
        }
      });
    }
    else {
      delete this.offerForm.redeemed_count;
      this.api.UPDATE_OFFER(this.offerForm).subscribe(result => {
        if(result.status) this.router.navigate(['/features/coupon-codes']);
        else {
          console.log("response", result);
          this.offerForm.errorMsg = result.message;
        }
      });
    }
  }

  // product
  getProductList(categoryId) {
    if(categoryId=='all' && this.allProductList.length) this.productList = this.allProductList;
    else {
      this.productListLoader = true;
      this.storeApi.PRODUCT_LIST({ category_id: categoryId }).subscribe(result => {
        setTimeout(() => { this.productListLoader = false; }, 500);
        if(result.status) {
          this.productList = result.list;
          if(categoryId=='all') this.allProductList = result.list;
        }
        else console.log("response", result);
      });
    }
  }
  openProdListModal(modalName) {
    if(this.offerForm.discount_type == 'buy_x_get_y') {
      if(this.offerForm.bx_gy_type=='buy') {
        this.productList.forEach(element => {
          element.checked = false;
          if(this.offerForm.buy_properties.product_list.findIndex(obj => obj.product_id==element._id) != -1) element.checked = true;
        });
      }
      else {
        this.productList.forEach(element => {
          element.checked = false;
          if(this.offerForm.get_properties.product_list.findIndex(obj => obj.product_id==element._id) != -1) element.checked = true;
        });
      }
    }
    else {
      this.productList.forEach(element => {
        element.checked = false;
        if(this.offerForm.product_list.findIndex(obj => obj.product_id==element._id) != -1) element.checked = true;
      });
    }
    this.modalService.open(modalName, { size: 'lg'});
  }
  onSubmitProduct() {
    this.offerForm.product_list = [];
    if(this.offerForm.discount_type == 'buy_x_get_y') {
      if(this.offerForm.bx_gy_type=='buy') {
        this.offerForm.buy_properties.product_list = [];
        this.productList.forEach(element => {
          element.product_id = element._id;
          element.image = element.image_list[0].image;
          if(element.checked) this.offerForm.buy_properties.product_list.push(element);
        });
      }
      else {
        this.offerForm.get_properties.product_list = [];
        this.productList.forEach(element => {
          element.product_id = element._id;
          element.image = element.image_list[0].image;
          if(element.checked) this.offerForm.get_properties.product_list.push(element);
        });
      }
    }
    else this.productList.forEach(element => {
      element.product_id = element._id;
      element.image = element.image_list[0].image;
      if(element.checked) this.offerForm.product_list.push(element);
    });
    document.getElementById('closeModal').click();
  }

  // category
  openCatListModal(modalName) {
    if(this.offerForm.discount_type == 'buy_x_get_y') {
      if(this.offerForm.bx_gy_type=='buy') {
        this.commonService.catalog_list.forEach(element => {
          element.checked = false;
          if(this.offerForm.buy_properties.category_list.findIndex(obj => obj.category_id==element._id) != -1) element.checked = true;
        });
      }
      else {
        this.commonService.catalog_list.forEach(element => {
          element.checked = false;
          if(this.offerForm.get_properties.category_list.findIndex(obj => obj.category_id==element._id) != -1) element.checked = true;
        });
      }
    }
    else {
      this.commonService.catalog_list.forEach(element => {
        element.checked = false;
        if(this.offerForm.category_list.findIndex(obj => obj.category_id==element._id) != -1) element.checked = true;
      });
    }
    this.modalService.open(modalName, { size: 'lg'});
  }
  onSubmitCategory() {
    this.offerForm.category_list = [];
    if(this.offerForm.discount_type == 'buy_x_get_y') {
      if(this.offerForm.bx_gy_type=='buy') {
        this.offerForm.buy_properties.category_list = [];
        this.commonService.catalog_list.forEach(element => {
          element.category_id = element._id;
          if(element.checked) this.offerForm.buy_properties.category_list.push(element);
        });
      }
      else {
        this.offerForm.get_properties.category_list = [];
        this.commonService.catalog_list.forEach(element => {
          element.category_id = element._id;
          if(element.checked) this.offerForm.get_properties.category_list.push(element);
        });
      }
    }
    else this.commonService.catalog_list.forEach(element => {
      element.category_id = element._id;
      if(element.checked) this.offerForm.category_list.push(element);
    });
    document.getElementById('closeModal').click();
  }
  
  // common
  getRandomCode() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < 6; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.offerForm[x] = this.commonService.timeConversion(time);
    });
  }

}