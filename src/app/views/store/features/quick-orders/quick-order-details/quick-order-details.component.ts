import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../../features-api.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-quick-order-details',
  templateUrl: './quick-order-details.component.html',
  styleUrls: ['./quick-order-details.component.scss']
})

export class QuickOrderDetailsComponent implements OnInit {

  orderForm: any = {};
  pageLoader: boolean;
  cart_list: any = [];
  page: any = 1; params: any;
  cart_total: any = 0; discount: any = 0;
  productDetails: any = {};
  product_list_modal_config: any = {};
  imgBaseUrl = environment.img_baseurl;
  product_list: any = []; addonList: any = [];
  formType: string = 'add';

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService, private api: FeaturesApiService, private router: Router,
    public commonService: CommonService, private atp: AmazingTimePickerService, private datePipe: DatePipe, private activeRoute: ActivatedRoute
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.pageLoader = true;
      // product features
      this.storeApi.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          let productFeatures = result.data;
          this.addonList = productFeatures.addon_list.filter(obj => obj.status == 'active').sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
        }
        // edit
        if(this.params.id) {
          this.formType = 'update';
          this.api.QUICK_ORDER_DETAILS(this.params.id).subscribe(result => {
            if(result.status) {
              this.orderForm = result.data;
              let itemIds = [];
              this.orderForm.item_list.forEach(obj => {
                if(itemIds.indexOf(obj.product_id)==-1) itemIds.push(obj.product_id);
              });
              this.storeApi.MULTI_PRODUCTS({ ids: itemIds }).subscribe(result => {
                setTimeout(() => { this.pageLoader = false; }, 500);
                if(result.status) {
                  let parentProductList = result.list;
                  this.orderForm.item_list.forEach(obj => {
                    let prodIndex = parentProductList.findIndex(prod => prod._id==obj.product_id);
                    if(prodIndex!=-1) this.createProduct(parentProductList[prodIndex], obj);
                  });
                  // cart total
                  this.cart_total = 0;
                  this.cart_list.forEach((product) => { this.cart_total += product.final_price; });
                  if(this.orderForm.disc_status) this.changeDiscValue();
                }
                else console.log("response", result);
              });
              if(this.orderForm.expiry_status) {
                this.orderForm.expiry_date = new Date(this.orderForm.expiry_on);
                this.orderForm.expiry_time = this.datePipe.transform(new Date(this.orderForm.expiry_on), 'hh:mm a');
              }
            }
            else console.log("response", result);
          });
        }
        // add
        if(this.params.count) {
          this.orderForm.name = "Quick Order "+this.params.count;
          setTimeout(() => { this.pageLoader = false; }, 500);
        }
      });
    });
  }

  createProduct(dbProdData, cartItemData) {
    let prodDetails: any = {
      product_id: dbProdData._id, name: dbProdData.name, quantity: cartItemData.quantity,
      unit: dbProdData.unit, addon_price: 0, image: cartItemData.image
    };
    // addon
    if(dbProdData.addon_status && cartItemData.addon_status) {
      let addonIndex = dbProdData.addon_list.findIndex(obj => obj.addon_id==cartItemData.addon_id);
      if(addonIndex!=-1) {
        addonIndex = this.addonList.findIndex(obj => obj._id==cartItemData.addon_id);
        if(addonIndex!=-1) {
          prodDetails.addon_status = true;
          prodDetails.addon_id = this.addonList[addonIndex]._id;
          prodDetails.addon_price = this.addonList[addonIndex].price;
        }
      }
    }
    // variants
    if(dbProdData.variant_status) {
      if(cartItemData.variant_status) {
        let variants = cartItemData.variant_types;
        let filterVariant = [];
        if(variants.length===1) {
          filterVariant = dbProdData.variant_list.filter(object => object[variants[0].name]==variants[0].value);
        }
        else if(variants.length===2) {
          filterVariant = dbProdData.variant_list.filter(object => object[variants[0].name]==variants[0].value && object[variants[1].name]==variants[1].value);
        }
        else if(variants.length===3) {
          filterVariant = dbProdData.variant_list.filter(object => object[variants[0].name]==variants[0].value && object[variants[1].name]==variants[1].value && object[variants[2].name]==variants[2].value);
        }
        if(filterVariant.length) {
          let varProdData = filterVariant[0];
          prodDetails.variant_status = true;
          prodDetails.variant_types = cartItemData.variant_types;
          prodDetails.discounted_price = varProdData.discounted_price;
          prodDetails.final_price = (parseFloat(prodDetails.discounted_price)+parseFloat(prodDetails.addon_price))*prodDetails.quantity;
          if(prodDetails.unit!="Pcs") {
            prodDetails.final_price = parseFloat(prodDetails.discounted_price)*prodDetails.quantity;
            prodDetails.final_price += parseFloat(prodDetails.addon_price);
          }
          this.cart_list.push(prodDetails);
        }
      }
    }
    else {
      prodDetails.variant_status = false;
      prodDetails.variant_types = [];
      prodDetails.discounted_price = dbProdData.discounted_price;
      prodDetails.final_price = (parseFloat(prodDetails.discounted_price)+parseFloat(prodDetails.addon_price))*prodDetails.quantity;
      if(prodDetails.unit!="Pcs") {
        prodDetails.final_price = parseFloat(prodDetails.discounted_price)*prodDetails.quantity;
        prodDetails.final_price += parseFloat(prodDetails.addon_price);
      }
      this.cart_list.push(prodDetails);
    }
  }

  onSubmit() {
    this.orderForm.cart_total = this.cart_total;
    this.orderForm.discount = this.discount;
    if(this.orderForm.expiry_status) {
      this.orderForm.expiry_on = new Date(this.datePipe.transform(new Date(this.orderForm.expiry_date), 'dd MMM y')+' '+this.orderForm.expiry_time);
    }
    this.orderForm.item_list = this.cart_list;
    if(this.formType=='add') {
      this.api.ADD_QUICK_ORDER(this.orderForm).subscribe(result => {
        if(result.status) this.router.navigate(["/features/quick-orders"]);
        else {
          this.orderForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_QUICK_ORDER(this.orderForm).subscribe(result => {
        if(result.status) this.router.navigate(["/features/quick-orders"]);
        else {
          this.orderForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  addtoCart() {
    if(this.productDetails.unit=="Pcs") {
      this.productDetails.final_price = (parseFloat(this.productDetails.discounted_price)+parseFloat(this.productDetails.addon_price))*this.productDetails.quantity;
    }
    else {
      this.productDetails.final_price = parseFloat(this.productDetails.discounted_price)*this.productDetails.quantity;
      this.productDetails.final_price += parseFloat(this.productDetails.addon_price);
    }
    this.addItemToCart(this.productDetails);
    document.getElementById('closeProductListModal').click();
  }
  addItemToCart(x) {
    let productDetails: any = {};
    productDetails.product_id = x._id;
    productDetails.quantity = x.quantity;
    productDetails.unit = x.unit;
    productDetails.image = x.image;
    productDetails.addon_status = x.addon_status;
    if(productDetails.addon_status) productDetails.addon_id = x.addon_id;
    productDetails.variant_status = x.variant_status;
    productDetails.variant_types = [];
    if(productDetails.variant_status) {
      x.variant_types.forEach(element => {
        productDetails.variant_types.push({ name: element.name, value: element.value });
      });
    }
    productDetails.sku = x.sku;
    productDetails.name = x.name;
    productDetails.addon_price = x.addon_price;
    productDetails.final_price = x.final_price;
    // check already exist in cart
    let cartIndex = this.cart_list.findIndex(obj => obj.product_id==productDetails.product_id && JSON.stringify(obj.variant_types)==JSON.stringify(productDetails.variant_types));
    // remove product, if already exist
    if(cartIndex != -1) this.cart_list.splice(cartIndex, 1);
    this.cart_list.push(productDetails);
    this.cart_list.forEach((obj, index) => {
      obj.cart_id = index+1;
    });
    this.calcCartTotal();
  }

  openProductListModal(modalName) {
    delete this.productDetails;
    this.product_list_modal_config = { search_input: "" };
    this.modalService.open(modalName, { windowClass:'xlModal' });
    if(!this.product_list.length) {
      this.product_list_modal_config.pageLoader = true;
      this.storeApi.PRODUCT_LIST({ category_id: 'all' }).subscribe( result => {
        this.product_list_modal_config.pageLoader = false;
        if(result.status) this.product_list = result.list.filter(obj => obj.stock>0);
      });
    }
  }
  onSelectProduct(x) {
    this.productDetails = { quantity: 1, addon_price: 0, image: x.image_list[0].image };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.productDetails[key] = x[key];
    }
    // variants
    if(this.productDetails.variant_status) {
      // for first option checked
      this.productDetails.variant_types.forEach(element => {
        element.value = element.options[0].value;
      });
      this.setVariantPrice();
    }
    // addons
    if(this.productDetails.addon_status) {
      this.productDetails.addon_list = this.addonList.filter(obj => this.productDetails.addon_list.findIndex(x => x.addon_id == obj._id) != -1 );
    }
  }

  setVariantPrice() {
    let variantInfo = []; let filterImgList = [];
    let variantImages = [];
    let productImgList = this.productDetails.image_list;
    let variantTypes = this.productDetails.variant_types;
    if(variantTypes.length===1) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value
      );
      if(this.productDetails.image_tag_status) filterImgList = productImgList.filter(obj => obj.tag==variantTypes[0].value);
    }
    else if(variantTypes.length===2) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value && element[variantTypes[1].name]==variantTypes[1].value
      );
      if(this.productDetails.image_tag_status) filterImgList = productImgList.filter(obj =>
        obj.tag==variantTypes[0].value || obj.tag==variantTypes[1].value
      );
    }
    else if(variantTypes.length===3) {
      variantInfo = this.productDetails.variant_list.filter(element => 
        element[variantTypes[0].name]==variantTypes[0].value && element[variantTypes[1].name]==variantTypes[1].value && element[variantTypes[2].name]==variantTypes[2].value
      );
      if(this.productDetails.image_tag_status) filterImgList = productImgList.filter(obj =>
        obj.tag==variantTypes[0].value || obj.tag==variantTypes[1].value || obj.tag==variantTypes[2].value
      );
    }
    // update price
    if(variantInfo[0].sku) this.productDetails.sku = variantInfo[0].sku;
    if(variantInfo[0].taxrate_id) this.productDetails.taxrate_id = variantInfo[0].taxrate_id;
    if(variantInfo[0].image_list && variantInfo[0].image_list.length) {
      variantInfo[0].image_list.forEach(elem => {
        let imgData = {};
        for(let key in elem) {
          if(elem.hasOwnProperty(key)) imgData[key] = elem[key];
        }
        variantImages.push(imgData);
      });
    }
    this.productDetails.selling_price = variantInfo[0].selling_price;
    this.productDetails.discounted_price = variantInfo[0].discounted_price;
    this.productDetails.stock = variantInfo[0].stock;
    this.productDetails.quantity = 1;
    // update image list
    this.productDetails.image_list = productImgList;
    if(filterImgList.length) {
      productImgList.filter(obj => !obj.tag && !obj.hide_on_variants).forEach(element => { filterImgList.push(element); });
      this.productDetails.image_list = filterImgList;
    }
    if(variantImages.length) {
      filterImgList.forEach(element => { variantImages.push(element); });
      if(!filterImgList.length) productImgList.filter(obj => !obj.tag && !obj.hide_on_variants).forEach(element => { variantImages.push(element); });
      this.productDetails.image_list = variantImages;
    }
    this.productDetails.image = this.productDetails.image_list[0].image;
  }
  changeAddon(x) {
    this.productDetails.addon_status = true;
    this.productDetails.addon_id = x._id;
    this.productDetails.addon_price = x.price;
  }

  calcCartTotal() {
    this.cart_total = 0;
    this.cart_list.forEach((product) => { this.cart_total += product.final_price; });
    // reset discount
    this.discount = 0;
    this.orderForm.disc_status = false;
  }

  incQty() {
    this.productDetails.quantity += 1;
    if((this.productDetails.quantity % 1) != 0) this.productDetails.quantity = parseFloat(this.productDetails.quantity.toFixed(2));
    if((this.productDetails.quantity) > this.productDetails.stock) this.productDetails.quantity = this.productDetails.stock;
  }
  decQty() {
    this.productDetails.quantity -= 1;
    if((this.productDetails.quantity % 1) != 0) this.productDetails.quantity = parseFloat(this.productDetails.quantity.toFixed(2));
    if(this.productDetails.quantity < 1) this.productDetails.quantity = 1;
  }

  removeItemFromCart(index) {
    this.cart_list.splice(index, 1);
    this.cart_list.forEach((obj, index) => { obj.cart_id = index+1; });
    this.calcCartTotal();
  }

  changeDiscValue() {
    this.discount = 0;
    if(this.orderForm.disc_config.value) {
      if(this.orderForm.disc_config.type=='percentage') {
        let discPercentage = this.orderForm.disc_config.value;
        if(this.orderForm.disc_config.value > 100) discPercentage = 100;
        let percentage = discPercentage/100;
        this.discount = parseFloat((this.cart_total*percentage).toFixed(2));
      }
      else {
        this.discount = this.orderForm.disc_config.value;
        if(this.orderForm.disc_config.value > this.cart_total) this.discount = this.cart_total;
      }
    }
  }

  timePicker() {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.orderForm.expiry_time = this.commonService.timeConversion(time);
    });
  }

  copyText(id) {
    let val = this.commonService.store_details.base_url+'/checkout/quick-order/'+id;
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.orderForm.copied= true;
    setTimeout(() =>{ this.orderForm.copied= false; }, 1000);
  }

  socialShare(id) {
    let windowNav: any = window.navigator;
    if(windowNav && windowNav.share) {
      windowNav.share({
        title: '', text: '',
        url: this.commonService.store_details.base_url+'/checkout/quick-order/'+id
      })
      .catch( (error) => { console.log(error); });
    }
    else console.log("share not supported");
  }

}