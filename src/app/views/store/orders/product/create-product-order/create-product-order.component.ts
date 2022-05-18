import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../../services/store-api.service';
import { OrderService } from '../../order.service';
import { ShippingService } from '../../../shipping/shipping.service';
import { CustomerApiService } from '../../../../../services/customer-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-create-product-order',
  templateUrl: './create-product-order.component.html',
  styleUrls: ['./create-product-order.component.scss']
})

export class CreateProductOrderComponent implements OnInit {

  imgBaseUrl = environment.img_baseurl; orderForm: any;
  page = 1; pageSize = 10;
  totalPages: number = 0; pagesList: any = []; categoryList: any = [{_id: 'all', name: "All Catalogs"}];
  customer_list: any = []; customer_list_modal_config: any; selected_customer: any;
  product_list: any = []; product_list_modal_config: any; productDetails: any;
  shipping_list: any = []; shipping_list_modal_config: any; selected_shipping: any;
  delivery_list: any = []; delivery_list_modal_config: any;
  selected_day: any; selected_slot: any;
  dayIndex: number = -1; delivery_id: string;
  product_features: any = { addon_list: [], measurement_set: [], tax_rates: [] };
  country_list: any = this.commonService.country_list; cart_list: any = [];
  cart_weight: any = 0; cart_total: any = 0; cart_qty: any = 0;
  discount: any = 0; shipping_cost: any = 0; wo_disc_sub_total: any = 0;
  payment_type: string; payment_status: string;

  existing_model_list: any = [];
  addonForm: any = {}; customized_model: any;
  custom_list: any = []; customIndex: number; selected_unit: any = {};
  measurement_sets: any = []; mmIndex: number; mm_section: boolean;
  notes_list: any = [];
  customSection: boolean; mmSection: boolean; noteSection: boolean;
  couponForm: any = {}; offerAmount: any = 0; manualDiscount: any = 0;
  application_setting: any = {}; checkout_setting: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: StoreApiService, private shippingApi: ShippingService,
    public commonService: CommonService, private customerApi: CustomerApiService, private OrderApi: OrderService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    // catalogs
    if(this.commonService.catalog_list.length) {
      this.commonService.catalog_list.forEach(element => {
        this.categoryList.push(element)
      });
    }
  }

  ngOnInit() {
    this.payment_type = 'cash'; this.payment_status = 'pending';
    this.orderForm = {
      store_id: this.commonService.store_details._id,
      item_list: [],
      coupon_list: [],
      currency_type: this.commonService.store_currency,
      discount_amount: 0,
      sub_total: 0,
      shipping_cost: 0,
      gift_wrapper: 0,
      grand_total: 0,
      final_price: 0,
      shipping_address: {},
      billing_address: {},
      shipping_method: {},
      payment_details: {},
      order_status: 'confirmed',
      confirmed_on: new Date()
    };
    // product features
    this.api.PRODUCT_FEATURES().subscribe(result => {
      if(result.status) {
        let productFeatures = result.data;
        this.product_features = {
          addon_list: productFeatures.addon_list.filter(obj => obj.status == 'active').sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1)),
          measurement_set: productFeatures.measurement_set.filter(obj => obj.status == 'active').sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1)),
          tax_rates: productFeatures.tax_rates.filter(obj => obj.status == 'active')
        };
      }
    });
    // application setting
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.application_setting = result.data.application_setting;
        this.checkout_setting = result.data.checkout_setting;
      }
    });
  }

  placeOrder() {
    this.orderForm.submit = true;
    this.orderForm.vendor_list = [];
    this.cart_list.forEach(element => {
      let finalPrice = (element.final_price*element.quantity)+parseFloat(element.addon_price);
      if(element.unit=="Pcs") finalPrice = element.final_price*element.quantity;
      // vendor
      if(element.vendor_id && this.commonService.ys_features.indexOf('vendors')!=-1) {
        let vendorIndex = this.orderForm.vendor_list.findIndex(obj => obj.vendor_id==element.vendor_id);
        if(vendorIndex != -1) this.orderForm.vendor_list[vendorIndex].total += finalPrice;
        else {
          let vendorData: any = { vendor_id: element.vendor_id, total: finalPrice };
          if(this.orderForm.order_status=='confirmed') {
            vendorData.status = 'confirmed';
            vendorData.confirmed_on = new Date();
          }
          this.orderForm.vendor_list.push(vendorData);
        }
      }
    });
    // coupon
    if(this.offerAmount > 0) {
      this.orderForm.offer_applied = true;
      this.orderForm.offer_details = { id: this.couponForm.id, code: this.couponForm.code, price: this.offerAmount };
    }
    this.orderForm.customer_id = this.selected_customer._id;
    this.orderForm.item_list = this.cart_list;
    this.orderForm.shipping_address = this.selected_customer.shipping_address;
    this.orderForm.billing_address = this.selected_customer.billing_address;
    this.orderForm.shipping_method = this.selected_shipping;
    if(this.payment_type!='other') this.orderForm.payment_details.name = this.payment_type;
    this.orderForm.payment_success = false;
    if(this.payment_status=='paid') this.orderForm.payment_success = true;
    this.orderForm.sub_total = this.cart_total;
    this.orderForm.shipping_cost = this.shipping_cost;
    this.orderForm.discount_amount = (this.offerAmount*1) + (this.manualDiscount*1);
    this.orderForm.grand_total = this.cart_total + this.orderForm.gift_wrapper + this.shipping_cost;
    this.orderForm.final_price = this.orderForm.grand_total - this.orderForm.discount_amount;
    // Hungover
    if(this.orderForm.store_id==environment.config_data.hungover_id) {
      this.orderForm.order_type = 'trial';
    }
    this.OrderApi.CREATE_ORDER(this.orderForm).subscribe(result => {
      this.orderForm.submit = true;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.goBack();
      }
      else {
        console.log("response", result);
        this.orderForm.errorMsg = result.message;
      }
    });
  }

  onApplyCoupon() {
    this.offerAmount = 0; this.manualDiscount = 0;
    this.orderForm.apply_disc = false; this.orderForm.manual_discount = {};
    if(this.couponForm.code) {
      this.calcCartQty(this.cart_list);
      this.customerApi.VALIDATE_OFFER_CODE({ store_id: this.commonService.store_details._id, customer_id: this.selected_customer._id, code: this.couponForm.code }).subscribe(result => {
        if(result.status) {
          this.couponForm.status = 'valid';
          let codeDetails = result.data;
          this.couponForm.id = codeDetails._id;
          if(this.wo_disc_sub_total >= codeDetails.min_order_amt && this.cart_qty >= codeDetails.min_order_qty) {
            if(codeDetails.discount_type=='buy_x_get_y') {
              this.cart_list.forEach(item => { delete item.dup_qty; });
              this.onFindBuyXGetY(codeDetails);
            }
            else {
              if(codeDetails.apply_to=='order') {
                this.onCalcOfferAmount(this.wo_disc_sub_total, codeDetails);
              }
              else if(codeDetails.apply_to=='shipping') {
                if(codeDetails.shipping_type=='all')
                  this.onCalcOfferAmount(this.selected_shipping.shipping_price, codeDetails);
                else if(codeDetails.shipping_type=='domestic' && this.selected_customer.shipping_address.country==this.commonService.store_details.country)
                  this.onCalcOfferAmount(this.selected_shipping.shipping_price, codeDetails);
                else if(codeDetails.shipping_type=='international' && this.selected_customer.shipping_address.country!=this.commonService.store_details.country)
                  this.onCalcOfferAmount(this.selected_shipping.shipping_price, codeDetails);
                else
                  this.couponForm.alert_msg = "You are not eligible to redeem this coupon";
              }
              else if(codeDetails.apply_to=='category') {
                let sumAmount = this.findCategoryUnderOffer(codeDetails.category_list);
                if(sumAmount > 0) this.onCalcOfferAmount(sumAmount, codeDetails);
                else this.couponForm.alert_msg = "You are not eligible to redeem this coupon";
              }
              else if(codeDetails.apply_to=='product') {
                let sumAmount = this.findProductUnderOffer(codeDetails.product_list);
                if(sumAmount > 0) this.onCalcOfferAmount(sumAmount, codeDetails);
                else this.couponForm.alert_msg = "You are not eligible to redeem this coupon";
              }
              else {
                this.couponForm.alert_msg = "You are not eligible to redeem this coupon";
              }
            }
          }
          else {
            this.couponForm.alert_msg = "You are not eligible to redeem this coupon";
          }
        }
        else {
          this.couponForm.alert_msg = result.message;
          this.couponForm.status = 'invalid';
          console.log("response", result);
        }
      });
    }
  }

  findCategoryUnderOffer(offerCategoryList) {
    let sumOfferProduct = 0;
    this.cart_list.forEach(item => {
      if(this.checkout_setting.offer_except_disc_products) {
        if(offerCategoryList.findIndex(obj => !item.disc_status && item.category_id.indexOf(obj.category_id)!=-1) != -1) sumOfferProduct += (item.final_price*item.quantity);
      }
      else {
        if(offerCategoryList.findIndex(obj => item.category_id.indexOf(obj.category_id)!=-1) != -1) sumOfferProduct += (item.final_price*item.quantity);
      }
    });
    return sumOfferProduct;
  }
  findProductUnderOffer(offerProductList) {
    let sumOfferProduct = 0;
    this.cart_list.forEach(item => {
      if(this.checkout_setting.offer_except_disc_products) {
        if(offerProductList.findIndex(obj => !item.disc_status && item.product_id==obj.product_id) != -1) sumOfferProduct += (item.final_price*item.quantity);
      }
      else {
        if(offerProductList.findIndex(obj => obj.product_id==item.product_id) != -1) sumOfferProduct += (item.final_price*item.quantity);
      }
    });
    return sumOfferProduct;
  }

  onCalcOfferAmount(amount, codeDetails) {
    let offerAmt = 0;
    offerAmt = codeDetails.discount_value;
    if(codeDetails.discount_type=='percentage') {
      offerAmt = Math.round(amount*(codeDetails.discount_value/100));
    }
    if(codeDetails.restrict_discount && offerAmt > codeDetails.discount_upto) offerAmt = codeDetails.discount_upto;
    let payableAmount = parseFloat(this.cart_total)+parseFloat(this.selected_shipping.shipping_price)+parseFloat(this.orderForm.gift_wrapper);
    this.offerAmount = offerAmt;
    if(offerAmt > payableAmount) this.offerAmount = payableAmount;
  }

  onFindBuyXGetY(codeDetails) {
    let offerAmt = 0; let buyXgetYitemList = [];
    let buyQty = 0; let buyAmount = 0; let getQty = 0;
    // buy products
    if(codeDetails.buy_properties.apply_to=='category') {
      this.cart_list.forEach(item => {
        let itemIndex = codeDetails.buy_properties.category_list.findIndex(obj => item.category_id.indexOf(obj.category_id)!=-1);
        if(this.checkout_setting.offer_except_disc_products) {
          itemIndex = codeDetails.buy_properties.category_list.findIndex(obj => !item.disc_status && item.category_id.indexOf(obj.category_id)!=-1);
        }
        if(itemIndex != -1) {
          buyQty += item.quantity;
          buyAmount += (item.final_price*item.quantity);
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    else if(codeDetails.buy_properties.apply_to=='product') {
      this.cart_list.forEach(item => {
        let itemIndex = codeDetails.buy_properties.product_list.findIndex(obj => item.product_id==obj.product_id);
        if(this.checkout_setting.offer_except_disc_products) {
          itemIndex = codeDetails.buy_properties.product_list.findIndex(obj => !item.disc_status && item.product_id==obj.product_id);
        }
        if(itemIndex != -1) {
          buyQty += item.quantity;
          buyAmount += (item.final_price*item.quantity);
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    else if(codeDetails.buy_properties.apply_to=='all_product') {
      this.cart_list.forEach(item => {
        let itemIndex = 0;
        if(this.checkout_setting.offer_except_disc_products) {
          if(item.disc_status) itemIndex = -1;
        }
        if(itemIndex != -1) {
          buyQty += item.quantity;
          buyAmount += (item.final_price*item.quantity);
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    // get products
    if(codeDetails.get_properties.apply_to=='category') {
      this.cart_list.forEach(item => {
        let itemIndex = codeDetails.get_properties.category_list.findIndex(obj => item.category_id.indexOf(obj.category_id)!=-1);
        if(this.checkout_setting.offer_except_disc_products) {
          itemIndex = codeDetails.get_properties.category_list.findIndex(obj => !item.disc_status && item.category_id.indexOf(obj.category_id)!=-1);
        }
        if(itemIndex != -1) {
          getQty += item.quantity;
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    else if(codeDetails.get_properties.apply_to=='product') {
      this.cart_list.forEach(item => {
        let itemIndex = codeDetails.get_properties.product_list.findIndex(obj => item.product_id==obj.product_id);
        if(this.checkout_setting.offer_except_disc_products) {
          itemIndex = codeDetails.get_properties.product_list.findIndex(obj => !item.disc_status && item.product_id==obj.product_id);
        }
        if(itemIndex != -1) {
          getQty += item.quantity;
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    else if(codeDetails.get_properties.apply_to=='all_product') {
      this.cart_list.forEach(item => {
        let itemIndex = 0;
        if(this.checkout_setting.offer_except_disc_products) {
          if(item.disc_status) itemIndex = -1;
        }
        if(itemIndex != -1) {
          getQty += item.quantity;
          let checkIndex = buyXgetYitemList.findIndex(obj => obj.cart_id==item.cart_id);
          if(checkIndex == -1) {
            item.dup_qty = item.quantity;
            buyXgetYitemList.push(item);
          }
        }
      });
    }
    // end

    if(codeDetails.buy_properties.type=='quantity') {
      let offeredItemsQty = 0
      buyXgetYitemList.forEach(item => { offeredItemsQty += item.quantity; })
      let setItemsCount = codeDetails.buy_properties.value + codeDetails.get_properties.quantity;
      let x = offeredItemsQty%setItemsCount;
      let loopCount = (offeredItemsQty-x)/setItemsCount;
      if(codeDetails.buy_x_get_y_usage_limit>0 && codeDetails.buy_x_get_y_usage_limit<loopCount) loopCount = codeDetails.buy_x_get_y_usage_limit;

      buyXgetYitemList.sort((a, b) => 0 - (a.final_price > b.final_price ? -1 : 1));
      for(let i=0; i<loopCount; i++)
      {
        if(buyQty>=codeDetails.buy_properties.value && getQty>=codeDetails.get_properties.quantity)
        {
          buyQty -= codeDetails.buy_properties.value;
          getQty -= codeDetails.get_properties.quantity;
          for(let j=0; j<codeDetails.get_properties.quantity; j++)
          {
            let offIndex = buyXgetYitemList.findIndex(obj => obj.dup_qty>=1);
            if(offIndex!=-1) {
              let selectedItem = buyXgetYitemList[offIndex];
              selectedItem.dup_qty -= 1;
              if(codeDetails.get_properties.discount_type=='quantity') offerAmt += selectedItem.final_price;
              else offerAmt += Math.round(selectedItem.final_price*(codeDetails.get_properties.discount_value/100));
            }
            else break;
          }
        }
        else break;
      }
    }
    if(codeDetails.buy_properties.type=='amount') {
      let x = buyAmount%codeDetails.buy_properties.value;
      let loopCount = (buyAmount-x)/codeDetails.buy_properties.value;
      if(codeDetails.buy_x_get_y_usage_limit>0 && codeDetails.buy_x_get_y_usage_limit<loopCount) loopCount = codeDetails.buy_x_get_y_usage_limit;
      
      for(let i=0; i<loopCount; i++)
      {
        let maxPrice = codeDetails.buy_properties.value;
        if(buyAmount>=maxPrice && getQty>=codeDetails.get_properties.quantity) {
          buyXgetYitemList.sort((a, b) => 0 - (a.final_price > b.final_price ? 1 : -1));
          for(let i=0; i<buyXgetYitemList.length; i++)
          {
            let item = buyXgetYitemList[i];
            if(maxPrice>0) {
              let loopCount = Math.ceil(item.dup_qty);
              for(let j=0; j<loopCount; j++)
              {
                if(item.dup_qty>0) {
                  if(item.dup_qty>=1) {
                    maxPrice -= item.final_price;
                    item.dup_qty -= 1;
                  }
                  else {
                    maxPrice -= (item.final_price*item.dup_qty);
                    item.dup_qty = 0;
                    break;
                  }
                }
              }
            }
            else break;
          }

          let filteredItemList = buyXgetYitemList.filter(obj => obj.dup_qty>0).sort((a, b) => 0 - (a.final_price > b.final_price ? -1 : 1));
          let remainingQty = 0;
          filteredItemList.forEach(item => { remainingQty += item.quantity });
          if(remainingQty>=codeDetails.get_properties.quantity) {
            for(let i=0; i<codeDetails.get_properties.quantity; i++)
            {
              let offIndex = filteredItemList.findIndex(obj => obj.dup_qty>=1);
              if(offIndex!=-1) {
                let selectedItem = filteredItemList[offIndex];
                selectedItem.dup_qty -= 1;
                getQty -= 1;
                if(codeDetails.get_properties.discount_type=='quantity') offerAmt += selectedItem.final_price;
                else offerAmt += Math.round(selectedItem.final_price*(codeDetails.get_properties.discount_value/100));
              }
              else break;
            }
          }
        }
        else break;
      }
    }

    if(codeDetails.restrict_discount && offerAmt > codeDetails.discount_upto) offerAmt = codeDetails.discount_upto;
    let payableAmount = parseFloat(this.cart_total)+parseFloat(this.selected_shipping.shipping_price)+parseFloat(this.orderForm.gift_wrapper);
    this.offerAmount = offerAmt;
    if(offerAmt > payableAmount) this.offerAmount = payableAmount;
  }

  openCustomerListModal(modalName) {
    this.page = 1;
    this.customer_list_modal_config = { search: "" };
    this.modalService.open(modalName, { windowClass:'xlModal' });
    this.customer_list_modal_config.pageLoader = true;
    this.onLoadCustomerData();
  }
  onLoadCustomerData() {
    this.commonService.scrollModalTop(0);
    this.customer_list_modal_config.skip = (this.page-1)*this.pageSize;
    this.customer_list_modal_config.limit = this.pageSize;
    this.customerApi.CUSTOMER_LIST(this.customer_list_modal_config).subscribe(result => {
      this.customer_list_modal_config.pageLoader = false;
      if(result.status) {
        this.customer_list = result.list;
        this.totalPages = Math.ceil(result.count/this.pageSize);
        this.pagesList = new Array(this.totalPages);
      }
      else console.log("response", result);
    });
  }
  onChangeCustomerPage(type) {
    if(type=='prev') this.page--;
    else this.page++;
    this.onLoadCustomerData();
  }

  changeDisc() {
    this.orderForm.manual_discount.amount = 0;
    let grandTotal = (this.cart_total + this.orderForm.gift_wrapper + this.shipping_cost) - this.offerAmount;
    if(this.orderForm.manual_discount.percentage) {
      if(this.orderForm.manual_discount.percentage > 100) this.orderForm.manual_discount.percentage = 100;
      let percentage = this.orderForm.manual_discount.percentage/100;
      this.orderForm.manual_discount.amount = parseFloat((grandTotal*percentage).toFixed(2));
    }
    this.manualDiscount = this.orderForm.manual_discount.amount;
  }
  changeDiscPrice() {
    let grandTotal = (this.cart_total + this.orderForm.gift_wrapper + this.shipping_cost) - this.offerAmount;
    if(this.orderForm.manual_discount.amount > grandTotal) this.orderForm.manual_discount.amount = grandTotal;
    this.manualDiscount = this.orderForm.manual_discount.amount;
  }

  onSelectShippingAddr(address) {
    // this.cart_list = []; 
    delete this.selected_shipping; 
    this.onGetAddrDetails(address);
    this.selected_customer.billing_address = address;
    this.selected_customer.shipping_address = address;
    let index = this.selected_customer.address_list.findIndex(obj => obj.billing_address);
    if(index!=-1) {
      this.selected_customer.billing_address = this.selected_customer.address_list[index];
      this.onGetAddrDetails(this.selected_customer.billing_address);
    }
    this.cart_total = 0; this.cart_weight = 0;
    this.resetDiscount();
  }
  onGetAddrDetails(address) {
    address.address_fields = [];
    let index = this.country_list.findIndex(object => object.name==address.country);
    if(index!=-1) {
      this.country_list[index].address_fields.forEach(element => {
        if(address[element.keyword]) address.address_fields.push({ label: element.label, value: address[element.keyword] });
      });
    }
  }

  // product list
  openProductListModal(modalName) {
    this.page = 1; delete this.productDetails;
    this.product_list_modal_config = {
      search: "", category_id: 'all', product_type: 'in', sort_by: 'created_desc'
    };
    this.modalService.open(modalName, { windowClass:'xlModal' });
    this.product_list_modal_config.pageLoader = true;
    this.onLoadProductData();
  }
  onLoadProductData() {
    this.commonService.scrollModalTop(0);
    this.product_list_modal_config.skip = (this.page-1)*this.pageSize;
    this.product_list_modal_config.limit = this.pageSize;
    this.api.PRODUCT_LIST(this.product_list_modal_config).subscribe(result => {
      this.product_list_modal_config.pageLoader = false;
      if(result.status) {
        this.product_list = result.list;
        this.totalPages = Math.ceil(result.count/this.pageSize);
        this.pagesList = new Array(this.totalPages);
      }
      else console.log("response", result);
    });
  }
  onChangeProductPage(type) {
    if(type=='prev') this.page--;
    else this.page++;
    this.onLoadProductData();
  }

  // shipping methods
  openShippingListModal(modalName) {
    this.selected_shipping = ''; this.shipping_cost = 0;
    this.shipping_list = [];
    this.shipping_list_modal_config = { pageLoader: true };
    this.modalService.open(modalName, { windowClass:'xlModal' });
    let shippingAddress = this.selected_customer.shipping_address;
    this.calcCartTotal();
    // shipping methods
    this.shippingApi.SHIPPING_LIST().subscribe(result => {
      setTimeout(() => { this.shipping_list_modal_config.pageLoader = false; }, 500);
      if(result.status) {
        if(shippingAddress.country==this.commonService.store_details.country) {
          // Domestic
          let domesticList = result.list.filter(obj => obj.shipping_type=='Domestic');
          for(let data of domesticList)
          {
            // zone based
            if(data.domes_zone_status) {
              this.findDomesticPrice(data.domes_zones, shippingAddress, this.cart_weight).then((respData: any) => {
                if(respData) {
                  if(data.free_shipping) {
                    if(this.cart_total >= data.minimum_price) respData.shipping_price = 0;
                  }
                  respData._id = data._id;
                  respData.name = data.name;
                  respData.tracking_link = data.tracking_link;
                  this.shipping_list.push(respData);
                }
              });
            }
            // non-zone based
            else {
              if(data.free_shipping) {
                if(this.cart_total >= data.minimum_price) data.shipping_price = 0;
              }
              let shipData: any = {
                _id: data._id, name: data.name, tracking_link: data.tracking_link,
                shipping_price: data.shipping_price, delivery_time: data.delivery_time
              }
              this.shipping_list.push(shipData);
            }
          }
        }
        else {
          // International
          let internationalList = result.list.filter(obj => obj.shipping_type=='International');
          for(let data of internationalList)
          {
            // zone based
            if(data.inter_zone_status) {
              this.findInternatioanlPrice(data.inter_zones, shippingAddress, this.cart_weight).then((respData: any) => {
                if(respData) {
                  if(data.free_shipping) {
                    if(this.cart_total >= data.minimum_price) respData.shipping_price = 0;
                  }
                  respData._id = data._id;
                  respData.name = data.name;
                  respData.tracking_link = data.tracking_link;
                  this.shipping_list.push(respData);
                }
              });
            }
            // non-zone based
            else {
              if(data.free_shipping) {
                if(this.cart_total >= data.minimum_price) data.shipping_price = 0;
              }
              let shipData: any = {
                _id: data._id, name: data.name, tracking_link: data.tracking_link,
                shipping_price: data.shipping_price, delivery_time: data.delivery_time
              }
              this.shipping_list.push(shipData);
            }
          }
        }
      }
      else console.log("response", result);
    });
  }
  clearShipping() {
    delete this.selected_shipping;
    this.shipping_cost = 0;
    this.resetDiscount();
  }

  // delivery methods
  openDeliveryMethodModal(modalName) {
    delete this.selected_day; delete this.selected_slot;
    delete this.delivery_id; this.dayIndex = -1;
    this.delivery_list = []; this.delivery_list_modal_config = { pageLoader: true };
    this.modalService.open(modalName, { windowClass:'xlModal' });
    let shippingAddress = this.selected_customer.shipping_address;
    this.calcCartTotal();
    // delivery methods
    this.shippingApi.DELIVERY_METHODS().subscribe(result => {
      setTimeout(() => { this.delivery_list_modal_config.pageLoader = false; }, 500);
      if(result.status) {
        this.delivery_id = result.data._id;
        let availableWeekDays = result.data.available_days;
        let deliveryList = [];
        let filteredDeliveryMethods = result.data.list.filter(obj => obj.status=='active');
        filteredDeliveryMethods.forEach(list => {
          let daysCount = list.following_days+1;
          for(let i=0; i<daysCount; i++) {
            let newSlotList = [];
            let filteredGroups = list.groups.filter(obj => obj.status=='active');
            filteredGroups.forEach((group, index) => {
              let delayDays = 0; let delayHours = 0;
              if(group.delay_type=='hour') delayHours = group.delay_duration;
              if(group.delay_type=='day' && group.delay_duration>0) {
                let orderTime = new Date().toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' })+" "+group.order_time;
                if(new Date() >= new Date(orderTime)) delayDays = group.delay_duration;
                else delayDays = group.delay_duration - 1;
              }
              let filteredSlots = group.slots.filter(obj => obj.status=='active');
              if(i < delayDays) {
                if(delayDays==0) {
                  if(group.status=='active') {
                    filteredSlots.forEach(slotData => {
                      slotData.delay_hrs = delayHours;
                      newSlotList.push(slotData);
                    });
                  }
                }
                else delayDays--;
              }
              else {
                filteredSlots.forEach(slotData => {
                  slotData.delay_hrs = delayHours;
                  newSlotList.push(slotData);
                });
              }
            });
            deliveryList.push({ name: list.name, slots: newSlotList });
          }
        });
        this.createList(deliveryList, availableWeekDays).then((resp) => {
          this.delivery_list = [];
          if(resp.findIndex(obj => obj.slots.length) != -1) this.delivery_list = resp;
          this.dayIndex = this.delivery_list.findIndex(obj => obj.slots.length && obj.available && obj.slots.findIndex(object => object.available)!=-1);
          if(this.dayIndex!=-1) {
            this.selected_day = this.delivery_list[this.dayIndex];
            let slotIndex = this.delivery_list[this.dayIndex].slots.findIndex(obj => obj.available);
            this.selected_slot = this.delivery_list[this.dayIndex].slots[slotIndex];
          }
        });
      }
      else console.log("response", result);
    });
  }
  onConfirmDeliveryMethod() {
    let date = new Date(this.selected_day.date).toLocaleString('en-US', { day: 'numeric' });
    let month = new Date(this.selected_day.date).toLocaleString('en-US', { month: 'long' });
    let year = new Date(this.selected_day.date).toLocaleString('en-US', { year: 'numeric' });
    let deliveryDate = date+" "+month+" "+year+" ("+this.selected_day.day+")";
    let deliveryTime = new Date(this.selected_slot.from).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+" - "+new Date(this.selected_slot.to).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    this.selected_shipping = {
      _id: this.delivery_id, delivery_method: true, delivery_date: deliveryDate, delivery_time: deliveryTime, shipping_price: this.selected_slot.price
    };
    this.shipping_cost = this.selected_slot.price;
    document.getElementById("closeModal").click();
  }

  async createList(deliveryList, availableWeekDays) {
    let updatedList = [];
    for(let i=0; i<deliveryList.length; i++) {
      deliveryList[i].day_value = "";
      if(i==0) { deliveryList[i].day_value = "Today"; }
      if(i==1) { deliveryList[i].day_value = "Tomorrow"; }
      let deliveryDate = new Date().setDate(new Date().getDate()+i);
      let availableDayIndex = availableWeekDays.findIndex(obj => obj.code==new Date(deliveryDate).getDay());
      deliveryList[i].day = availableWeekDays[availableDayIndex].day;
      deliveryList[i].date = deliveryDate;
      deliveryList[i].slots = await this.processSlot(deliveryDate, deliveryList[i].slots);
      deliveryList[i].available = false;
      if(availableWeekDays[availableDayIndex].active && deliveryList[i].slots.findIndex(obj => obj.available)!=-1) deliveryList[i].available = true;
      updatedList.push(deliveryList[i]);
    }
    return updatedList;
  }
  processSlot(deliveryDate, slotList) {
    return new Promise((resolve, reject) => {
      let updatedSlotList = [];
      let bookingDay = new Date(deliveryDate).toLocaleString('en-US', { day: '2-digit', month: 'numeric', year: 'numeric' });
      for(let slot of slotList) {
        let restrictDate = new Date().setHours(new Date().getHours()+slot.delay_hrs);
        let fromTime: any = new Date(bookingDay+" "+slot.from_time).getTime();
        let toTime: any = new Date(bookingDay+" "+slot.to_time).getTime();
        if(restrictDate <= fromTime) updatedSlotList.push({ from: fromTime, to: toTime, price: slot.price, available: true });
        else updatedSlotList.push({ from: fromTime, to: toTime, price: slot.price, available: false });
      }
      resolve(updatedSlotList);
    });
  }
  dayChange(day) {
    this.selected_day = day;
    let slotIndex = this.selected_day.slots.findIndex(obj => obj.available);
    this.selected_slot = this.selected_day.slots[slotIndex];
  }

  findInternatioanlPrice(zones, shippingAddress, cartWeight) {
    return new Promise((resolve, reject) => {
      // zone
      let filterZone = zones.filter(obj => obj.countries.findIndex(x => x == shippingAddress.country)!=-1);
      if(filterZone.length && filterZone[0].rate_multiplier.length) {
        // multiplier
        let rateMultiplier = filterZone[0].rate_multiplier;
        rateMultiplier.sort((a, b) => 0 - (a.weight > b.weight ? -1 : 1));  // sort asc
        let shippingMultiplier = rateMultiplier[rateMultiplier.length - 1].multiplier;
        let filterMultiplier = rateMultiplier.filter(obj => obj.weight>=cartWeight);
        if(filterMultiplier.length) shippingMultiplier = filterMultiplier[0].multiplier;
        // find price
        let zonePrice = Math.round(filterZone[0].price_per_kg*shippingMultiplier);
        resolve({ shipping_price: zonePrice, delivery_time: filterZone[0].delivery_time })
      }
      else {
        resolve(null);
      }
    });
  }

  findDomesticPrice(zones, shippingAddress, cartWeight) {
    return new Promise((resolve, reject) => {
      // zone
      let filterZone = zones.filter(obj => obj.states.findIndex(x => x == shippingAddress.state)!=-1);
      if(filterZone.length && filterZone[0].rate_multiplier.length) {
        // multiplier
        let rateMultiplier = filterZone[0].rate_multiplier;
        rateMultiplier.sort((a, b) => 0 - (a.weight > b.weight ? -1 : 1));  // sort asc
        let shippingMultiplier = rateMultiplier[rateMultiplier.length - 1].multiplier;
        let filterMultiplier = rateMultiplier.filter(obj => obj.weight>=cartWeight);
        if(filterMultiplier.length) shippingMultiplier = filterMultiplier[0].multiplier;
        // find price
        let zonePrice = Math.round(filterZone[0].price_per_kg*shippingMultiplier);
        resolve({ shipping_price: zonePrice, delivery_time: filterZone[0].delivery_time })
      }
      else {
        resolve(null);
      }
    });
  }

  calcCartTotal() {
    this.cart_total = 0; this.cart_weight = 0; this.wo_disc_sub_total = 0;
    this.cart_list.forEach((product) => {
      this.cart_total += (product.final_price * product.quantity);
      if(this.checkout_setting.offer_except_disc_products) {
        if(!product.disc_status) this.wo_disc_sub_total += (product.final_price * product.quantity);
      }
      else {
        this.wo_disc_sub_total += (product.final_price * product.quantity);
      }
      if(product.unit!="Pcs") {
        this.cart_total += product.addon_price;
        if(this.checkout_setting.offer_except_disc_products) {
          if(!product.disc_status) this.wo_disc_sub_total += product.addon_price;
        }
        else {
          this.wo_disc_sub_total += product.addon_price;
        }
      }
      this.cart_weight += (parseFloat(product.weight)*parseFloat(product.quantity));
    });
    Math.round(this.cart_weight);
  }

  calcCartQty(itemList) {
    this.cart_qty = 0;
    itemList.forEach(obj => {
      if(obj.unit=="Pcs") this.cart_qty += obj.quantity;
      else this.cart_qty += 1;
    });
  }

  onSelectProduct(x) {
    this.productDetails = {
      product_id: x._id,
      category_id: x.category_id,
      sku: x.sku,
      hsn_code: x.hsn_code,
      name: x.name,
      weight: x.weight,
      selling_price: x.selling_price,
      stock: x.stock,
      unit: x.unit,
      disc_status: x.disc_status,
      discounted_price: x.discounted_price,
      variant_status: x.variant_status,
      variant_types: x.variant_types,
      variant_list: x.variant_list,
      addon_status: x.addon_status,
      addon_list: x.addon_list,
      vendor_id: x.vendor_id,
      taxrate_id: x.taxrate_id,
      quantity: 1,
      additional_qty: 0,
      addon_price: 0,
      image: x.image_list[0].image
    };
    delete this.customized_model;
    // variants
    if(this.productDetails.variant_status) {
      // for first option checked
      this.productDetails.variant_types.forEach(element => {
        element.value = element.options[0].value;
      });
      this.setVariantPrice();
    }
    this.setProductFeatures();
  }

  setVariantPrice() {
    let variantInfo = [];
    let variantTypes = this.productDetails.variant_types;
    if(variantTypes.length===1) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value
      );
    }
    else if(variantTypes.length===2) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value && element[variantTypes[1].name]==variantTypes[1].value
      );
    }
    else if(variantTypes.length===3) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value && element[variantTypes[1].name]==variantTypes[1].value && element[variantTypes[2].name]==variantTypes[2].value
      );
    }
    // update price
    if(variantInfo[0].sku) this.productDetails.sku = variantInfo[0].sku;
    if(variantInfo[0].taxrate_id) this.productDetails.taxrate_id = variantInfo[0].taxrate_id;
    this.productDetails.selling_price = variantInfo[0].selling_price;
    this.productDetails.discounted_price = variantInfo[0].discounted_price;
    this.productDetails.stock = variantInfo[0].stock;
    this.productDetails.quantity = 1;
  }

  incQty() {
    this.productDetails.quantity += 1;
    if((this.productDetails.quantity % 1) != 0) this.productDetails.quantity = parseFloat(this.productDetails.quantity.toFixed(2));
    if((this.productDetails.quantity+this.productDetails.additional_qty) > this.productDetails.stock) this.productDetails.quantity = this.productDetails.stock-this.productDetails.additional_qty;
  }
  decQty() {
    this.productDetails.quantity -= 1;
    if((this.productDetails.quantity % 1) != 0) this.productDetails.quantity = parseFloat(this.productDetails.quantity.toFixed(2));
    if(this.productDetails.quantity < 1) this.productDetails.quantity = 1;
  }

  setProductFeatures() {
    // addons
    if(this.productDetails.addon_status) {
      let filteredAddons = this.product_features.addon_list.filter(obj => this.productDetails.addon_list.findIndex(x => x.addon_id == obj._id) != -1 );
      this.buildAddonList(filteredAddons, this.product_features.measurement_set).then((resp: any) => {
        this.productDetails.addon_list = resp;
      });
    }
    // tax rates
    if(this.productDetails.taxrate_id) {
      let taxRates = this.product_features.tax_rates;
      let taxIndex = taxRates.findIndex(obj => obj._id==this.productDetails.taxrate_id);
      if(taxIndex!=-1) this.productDetails.tax_details = taxRates[taxIndex];
      else delete this.productDetails.taxrate_id;
    }
  }
  // CUSTOMIZATION
  buildAddonList(addonList, overallmmList) {
    return new Promise((resolve, reject) => {
      addonList.forEach(addonObj => {
        // mm list
        addonObj.updated_mm_list = [];
        if(addonObj.mm_list.length) {
          addonObj.mm_list.forEach(obj => {
            let mmIndex = overallmmList.findIndex(elem => elem._id==obj.mmset_id);
            if(mmIndex!=-1) addonObj.updated_mm_list.push(overallmmList[mmIndex]);
          });
        }
      });
      resolve(addonList);
    });
  }

  onChangeAddon() {
    if(this.productDetails.quantity > this.productDetails.stock) this.productDetails.quantity = this.productDetails.stock;
    if(this.productDetails.quantity < 1) this.productDetails.quantity = 1;
    this.customized_model = null;
    this.productDetails.addon_alert = false;
    this.calcAddonPrice();
  }

  calcAddonPrice() {
    let customizedPrice = 0; this.productDetails.additional_qty = 0;
    if(this.customized_model && this.customized_model.addon_id==this.productDetails.selected_addon._id) {
      // custom list
      this.customized_model.custom_list.forEach(obj => {
        obj.value.forEach(element => {
          customizedPrice += element.price;
          this.productDetails.additional_qty += element.additional_qty;
        });
      });
      // mm sets
      this.customized_model.mm_sets.forEach(obj => {
        obj.list.forEach(element => {
          this.productDetails.additional_qty += element.additional_qty;
        });
      });
    }
    this.productDetails.addon_price = this.productDetails.selected_addon.price+customizedPrice;
    if((this.productDetails.additional_qty % 1) != 0) this.productDetails.additional_qty = parseFloat(this.productDetails.additional_qty.toFixed(1));
  }

  addtoCart() {
    this.productDetails.final_price = parseFloat(this.productDetails.discounted_price);
    if(this.productDetails.unit=="Pcs") {
      this.productDetails.final_price = parseFloat(this.productDetails.discounted_price)+parseFloat(this.productDetails.addon_price);
    }
    this.productDetails.customized_model = this.customized_model;
    this.productDetails.customization_status = false;
    if(this.productDetails.customized_model) this.productDetails.customization_status = true;
    if(this.productDetails.addon_status && this.productDetails.addon_list.length)
    {
      // if select any addon
      if(this.productDetails.selected_addon && this.productDetails.selected_addon!=undefined) {
        this.addItemToCart(this.productDetails);
        document.getElementById('closeProductListModal').click();
      }
      // else this.productDetails.addon_alert = true;
      else {
        this.productDetails.addon_status = false;
        this.addItemToCart(this.productDetails);
        document.getElementById('closeProductListModal').click();
      }
    }
    else {
      this.productDetails.addon_status = false;
      this.addItemToCart(this.productDetails);
      document.getElementById('closeProductListModal').click();
    }
  }

  // CUSTOMIZATION SECTION
  onCreateCustomization(existingListModal, createNewModal) {
    if(this.productDetails.selected_addon) {
      if(this.productDetails.selected_addon.custom_list.length || this.productDetails.selected_addon.updated_mm_list.length ||  this.productDetails.selected_addon.notes_list.length) {
        if(this.productDetails.quantity > this.productDetails.stock) this.productDetails.quantity = this.productDetails.stock;
        if(this.productDetails.quantity < 1) this.productDetails.quantity = 1;
        this.customIndex = 0; this.mmIndex = 0; this.addonForm = {};
        this.custom_list = this.productDetails.selected_addon.custom_list;
        this.measurement_sets = this.productDetails.selected_addon.updated_mm_list;
        this.measurement_sets.forEach(mm => {
          mm.list.forEach(li => { delete li.value });
        });
        this.notes_list = [];
        this.productDetails.selected_addon.notes_list.forEach(obj => {
          this.notes_list.push({ name: obj.name, required: obj.required });
        });
        this.customSection = false; this.mmSection = false; this.noteSection = false;
        // customization
        if(this.custom_list.length) {
          this.customSection = true;
          this.custom_list.forEach(obj => {
            delete obj.selected_option;
            obj.option_list.forEach(opt => { delete opt.custom_option_checked; delete opt.disabled; });
          });
          this.custom_list[this.customIndex].filtered_option_list = this.custom_list[this.customIndex].option_list;
          if(this.custom_list[this.customIndex].type=='either_or') {
            this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
            this.getRadioNextList(this.custom_list[this.customIndex].selected_option);
          }
        }
        // measurement
        else if(this.measurement_sets.length) {
          this.mmSection = true;
          this.selected_unit = this.measurement_sets[this.mmIndex].units[0];
          this.addonForm.mm_unit = this.selected_unit.name;
        }
        // notes
        else this.noteSection = true;
        if(this.commonService.store_details.additional_features && this.commonService.store_details.additional_features.custom_model) {
          this.productDetails.custom_loader = true;
          this.customerApi.CUSTOMER_DETAILS(this.selected_customer._id).subscribe(result => {
            this.productDetails.custom_loader = false;
            if(result.status) {
              this.existing_model_list = result.data.model_list.filter(obj => obj.addon_id==this.productDetails.selected_addon._id);
              if(this.existing_model_list.length) this.modalService.open(existingListModal, { windowClass:'xlModal' });
              else this.modalService.open(createNewModal, { windowClass:'xlModal' });
              this.commonService.scrollModalTop(500);
            }
            else console.log("response", result);
          });
        }
        else {
          this.modalService.open(createNewModal, { windowClass:'xlModal' });
          this.commonService.scrollModalTop(500);
        }
      }
    }
  }

  onSaveNewModal() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      let customAlert = this.checkCustomSelection();
      if(!customAlert) {
        this.addonForm.addon_id = this.productDetails.selected_addon._id;
        this.addonForm.price = this.productDetails.selected_addon.price;
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
        // measurement section (for find additional qty)
        if(this.measurement_sets.length) {
          for(let elem of this.measurement_sets[this.mmIndex].list) {
            elem.additional_qty = 0;
            if(elem.conditions.length) {
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
        }
        this.addonForm.mm_sets = this.measurement_sets;
        if(this.commonService.store_details.additional_features && this.commonService.store_details.additional_features.custom_model) {
          let noteIndex = this.notes_list.findIndex(obj => obj.value && obj.value!="");
          if(noteIndex!=-1) this.addonForm.notes_list = this.notes_list;
          this.addonForm.submit = true;
          this.addonForm.customer_id = this.selected_customer._id;
          this.customerApi.ADD_MODEL(this.addonForm).subscribe(result => {
            this.addonForm.submit = false;
            if(result.status) {
              this.customized_model = this.addonForm;
              this.calcAddonPrice();
              document.getElementById('closeCreateNewModal').click();
            }
            else {
              console.log("response", result);
              this.addonForm.alert_msg = result.message;
            }
          });
        }
        else {
          this.addonForm.notes_list = this.notes_list.filter(obj => obj.value && obj.value!="");
          this.addonForm.name = this.productDetails.selected_addon.name;
          this.customized_model = this.addonForm;
          this.calcAddonPrice();
          document.getElementById('closeCreateNewModal').click();
        }
      }
      else this.addonForm.alert_msg = customAlert;
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }

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

  customPrev() {
    if(this.customSection) {
      this.customIndex -= 1;
    }
    else if(this.mmSection) {
      if(this.mmIndex>0) this.mmIndex -= 1;
      else if(this.custom_list.length) {
        this.mmSection = false;
        this.customSection = true;
      }
    }
    else if(this.noteSection) {
      this.noteSection = false;
      if(this.measurement_sets.length) this.mmSection = true;
      else this.customSection = true;
    }
    this.addonForm.alert_msg = null;
    this.commonService.scrollModalTop(0);
  }
  onCustomNext(gotoNext) {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      let customAlert = this.checkCustomSelection();
      if(!customAlert) {
        // customization next level
        if(!gotoNext) {
          this.mmSection = false; this.noteSection = false;
          this.customIndex = this.customIndex+1;
          if(this.custom_list[this.customIndex].type=='either_or') {
            if(this.custom_list[this.customIndex].selected_option) {
              if(this.custom_list[this.customIndex].filtered_option_list.findIndex(obj => obj.name==this.custom_list[this.customIndex].selected_option) == -1) {
                this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
              }
            }
            else {
              this.custom_list[this.customIndex].selected_option = this.custom_list[this.customIndex].filtered_option_list[0].name;
            }
            this.getRadioNextList(this.custom_list[this.customIndex].selected_option);
          }
          else this.disableOption();
        }
        // measurement or custom note
        else {
          this.customSection = false; this.mmSection = false; this.noteSection = false;
          // measurement
          if(this.measurement_sets.length) {
            this.mmIndex = 0; this.mmSection = true;
            this.selected_unit = this.measurement_sets[this.mmIndex].units[0];
            this.addonForm.mm_unit = this.selected_unit.name;
          }
          // custom note
          else this.noteSection = true;
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
  onMmNext() {
    let reqInput = this.validateForm();
    if(reqInput===undefined) {
      // for find additional qty
      for(let elem of this.measurement_sets[this.mmIndex].list) {
        elem.additional_qty = 0;
        if(elem.conditions.length) {
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
      if((this.measurement_sets.length-1) > this.mmIndex) this.mmIndex = this.mmIndex+1;
      else {
        this.customSection = false;
        this.mmSection = false;
        this.noteSection = true;
      }
      this.commonService.scrollModalTop(0);
    }
    else {
      this.addonForm.alert_msg = "Please fill out the mandatory fields";
      document.getElementById(reqInput).focus();
    }
  }
  
  onChangeUnit() {
    let unitIndex = this.measurement_sets[this.mmIndex].units.findIndex(obj => obj.name==this.addonForm.mm_unit);
    if(unitIndex!=-1) this.selected_unit = this.measurement_sets[this.mmIndex].units[unitIndex];
    if(this.addonForm.mm_unit=='cms') {
      // convert inch -> cm
      this.measurement_sets.forEach(set => {
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
      this.measurement_sets.forEach(set => {
        set.list.forEach(element => {
          if(element.value) {
            element.value = element.value*0.393701;
            if((element.value % 1) != 0) element.value = parseFloat(element.value.toFixed(1));
          }
        });
      });
    }
  }

  validateForm() {
    let form: any = document.getElementById('addon-form');
    for(let elem of form.elements) {
      if(elem.value === '' && elem.hasAttribute('required')) return elem.id;
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
  checkCustomSelection() {
    if(this.custom_list.length) {
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
    else return null;
  }

  addItemToCart(x) {
    let productDetails: any = {};
    productDetails.category_id = x.category_id;
    productDetails.product_id = x.product_id;
    productDetails.sku = x.sku;
    productDetails.name = x.name;
    productDetails.weight = x.weight;
    productDetails.quantity = x.quantity+x.additional_qty;
    productDetails.additional_qty = x.additional_qty;
    productDetails.unit = x.unit;
    productDetails.stock = x.stock;
    productDetails.selling_price = x.selling_price;
    productDetails.disc_status = x.disc_status;
    productDetails.disc_percentage = x.disc_percentage;
    productDetails.discounted_price = x.discounted_price;
    productDetails.addon_price = x.addon_price;
    productDetails.final_price = x.final_price;
    productDetails.addon_status = x.addon_status;
    if(productDetails.addon_status) productDetails.selected_addon = x.selected_addon;
    productDetails.customization_status = x.customization_status;
    if(productDetails.customization_status) productDetails.customized_model = x.customized_model;
    productDetails.variant_status = x.variant_status;
    productDetails.variant_types = [];
    if(x.hsn_code) productDetails.hsn_code = x.hsn_code;
    if(x.vendor_id) productDetails.vendor_id = x.vendor_id;
    if(productDetails.variant_status) {
      x.variant_types.forEach(element => {
        productDetails.variant_types.push({ name: element.name, value: element.value });
      });
    }
    if(x.taxrate_id) {
      productDetails.taxrate_id = x.taxrate_id;
      productDetails.tax_details = x.tax_details;
    }
    productDetails.seo_status = x.seo_status;
    productDetails.seo_details = x.seo_details;
    productDetails.image = x.image;
    // check already exist in cart
    let cartIndex = this.cart_list.findIndex(obj => obj.product_id==x.product_id && JSON.stringify(obj.variant_types)==JSON.stringify(x.variant_types));
    // remove product, if already exist
    if(cartIndex != -1) this.cart_list.splice(cartIndex, 1);
    this.cart_list.push(productDetails);
    this.cart_list.forEach((obj, index) => {
      obj.cart_id = index+1;
    });
    this.shipping_cost = 0;
    this.selected_shipping = '';
    this.calcCartTotal();
    this.resetDiscount();
  }
  removeItemFromCart(index) {
    this.shipping_cost = 0;
    this.selected_shipping = '';
    this.cart_list.splice(index, 1);
    this.cart_list.forEach((obj, index) => {
      obj.cart_id = index+1;
    });
    this.calcCartTotal();
    this.resetDiscount();
  }

  resetDiscount() {
    this.manualDiscount = 0; this.offerAmount = 0; this.orderForm.apply_disc = false;
    this.orderForm.manual_discount = {}; this.couponForm = {};
  }

}