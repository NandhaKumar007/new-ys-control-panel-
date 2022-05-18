import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { StoreApiService } from '../../../../services/store-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.scss'],
  animations: [SharedAnimations]
})

export class ModifyProductComponent implements OnInit {

  maxRank: any = 0; existVariantList: any = [];
  productForm: any; step_num: any;
  pageLoader: boolean; btnLoader: boolean;
  categoryList: any = []; intForm: any = {};
  addonList: any; tagList: any; noteList: any; taxRates: any; taxonomyList: any;
  sizeCharts: any; faqList: any; aiStyleList: any; colorList: any; amenityList: any;
  imgBaseUrl = environment.img_baseurl; addonCheckedCount: any = 0;
  cropperSettings: CropperSettings; imageIndex: any;
  imgWidth: any; imgHeight: any; primary_tax: any;
  image_count: number = environment.default_img_count;
  selectedVariantOptions: any []; selectedVariantIndex: number;
  configData: any= environment.config_data; brochForm: any = {};

  @ViewChild('cropper', {static: false}) cropper: ImageCropperComponent;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService,
    private peApi: ProductExtrasApiService, public commonService: CommonService, private customerApi: CustomerApiService, private atp: AmazingTimePickerService,
    private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    let resolution = this.commonService.store_details.additional_features.cropper_resolution.split("x");
    this.imgWidth = resolution[0]; this.imgHeight = resolution[1];
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.croppedWidth = this.imgWidth; this.cropperSettings.croppedHeight = this.imgHeight;
    this.cropperSettings.canvasWidth = this.imgWidth/3; this.cropperSettings.canvasHeight = this.imgHeight/3;
    this.cropperSettings.width = this.imgWidth; this.cropperSettings.height = this.imgHeight;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.noFileInput = true;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.aiStyleList = [];
      if(this.commonService.ys_features.indexOf('variant_image_tag')!=-1) this.image_count = environment.variant_img_count;
      this.btnLoader = false; this.pageLoader = true;
      this.maxRank = params.rank; this.step_num = params.step;
      this.addonList = []; this.tagList = []; this.noteList = []; this.taxRates = []; this.sizeCharts = [];
      this.api.PRODUCT_FEATURES().subscribe(result => {
        
        if(result.status) {
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          this.amenityList = result.data.amenities.filter(obj => obj.status=='active');
          let tempAddonList = result.data.addon_list.filter(obj => obj.status=='active');
          let tempTagList = result.data.tag_list.filter(obj => obj.status=='active');
          let tempFaqList = result.data.faq_list.filter(obj => obj.status=='active');
          let tempNoteList = result.data.footnote_list;
          if(this.commonService.ys_features.indexOf('tax_rates')!=-1) {
            this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
            if(this.taxRates.length) {
              let taxIndex = this.taxRates.findIndex(obj => obj.primary);
              if(taxIndex!=-1) this.primary_tax = this.taxRates[taxIndex]._id;
            }
          }
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          this.colorList = result.data.color_list;
          this.api.PRODUCT_DETAILS(params.product_id).subscribe(result => {
            if(result.status) {
              this.productForm = result.data;
              if(this.productForm.handover_on) this.productForm.handover_on = new Date(this.productForm.handover_on);
              if(!this.productForm.video_details) this.productForm.video_details = {};
              this.productForm.prev_rank = result.data.rank;
              if(this.productForm.image_tag_status) {
                this.productForm.variant_types.forEach(element => {
                  if(element.options.findIndex(obj => obj.value==this.productForm.image_list[0].tag) != -1) this.productForm.tag_variant = element.options;
                });
              }
              if(this.productForm.variant_list?.length) {
                this.existVariantList = this.productForm.variant_list;
                this.productForm.variant_list.forEach(element => {
                  if(!element.sku) element.sku = this.productForm.sku;
                  if(!element.taxrate_id && this.productForm.taxrate_id) element.taxrate_id = this.productForm.taxrate_id;
                });
              }

              // apply image
              if(this.productForm.badges) {
                this.productForm.badges_status = true;
                let value = this.productForm.badges;
                this.productForm.badges_list=[];
                value.forEach(element => {
                  this.productForm.badges_list.push({value:element , display:element});
                });
              }


              this.adddonListModify(tempAddonList, this.productForm.addon_list).then((list) => {
                this.addonList = list;
              });
              this.tagListModify(tempTagList, this.productForm.tag_list).then((list) => {
                this.tagList = list;
              });
              this.faqListModify(tempFaqList, this.productForm.faq_list).then((list) => {
                this.faqList = list;
              });
              this.processCategoryList(this.productForm.category_id).then((list) => {
                this.categoryList = list;
              });
              if(tempAddonList.length==this.addonCheckedCount) this.productForm.select_all = true;
              // foot note
              if(this.productForm.footnote_list.length) {
                this.productForm.note_status = true;
                this.footNoteListModify(tempNoteList, this.productForm.footnote_list).then((list) => {
                  this.noteList = tempNoteList;
                });
              }
              else this.noteList = tempNoteList;
              // Amenities
              if(this.productForm.amenity_list?.length) {
                this.productForm.amenity_status = true;
                this.amenityList.forEach(al => {
                  if(this.productForm.amenity_list.indexOf(al._id) != -1) al.amen_checked = true;
                });
              }
              // Availability
              if(this.commonService.ys_features.indexOf('product_availability')!=-1) {
                if(this.productForm.available_days.length) {
                  this.productForm.availability_status = true;
                }
                else {
                  this.productForm.available_days = [
                    { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
                    { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
                    { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
                    { code: 6, day: "Saturday", active: false, opening_hrs: [] }
                  ];
                }
              }
              // AI Styles
              if(this.commonService.ys_features.indexOf('shopping_assistant')!=-1) {
                if(this.productForm.aistyle_list.length) this.productForm.aistyle_status = true;
                if(localStorage.getItem("aistyle_list")) {
                  this.aiStyleList = this.commonService.decryptData(localStorage.getItem("aistyle_list"));
                  this.aiStyleModify(this.aiStyleList, this.productForm.aistyle_list).then((list) => {
                    this.aiStyleList = list;
                  });
                }
                else {
                  this.peApi.AI_STYLE_DETAILS().subscribe(result => {
                    if(result.status) {
                      this.commonService.aistyle_list = result.data;
                      this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
                      this.aiStyleList = result.data;
                      this.aiStyleModify(this.aiStyleList, this.productForm.aistyle_list).then((list) => {
                        this.aiStyleList = list;
                      });
                    }
                  });
                }
              }
            }
            else console.log("response", result);
            setTimeout(() => { this.pageLoader = false; }, 500);
          });
        }
        else console.log("response", result);
      });
    });
  }

  onUpdateDetails() {
    this.btnLoader = true;
    
    // discount
    if(!this.productForm.disc_status) {
      this.productForm.disc_percentage = null;
      this.productForm.discounted_price = this.productForm.selling_price;
      if(this.productForm.variant_list) {
        this.productForm.variant_list.forEach(object => {
          object.discounted_price = object.selling_price;
        });
      }
    }
    // variants
    if(this.productForm.variant_status) {
      let totalStock = 0;
      this.productForm.variant_list.forEach(object => {
        totalStock += parseFloat(object.stock);
      });
      if(this.productForm.variant_list[0].taxrate_id) this.productForm.taxrate_id = this.productForm.variant_list[0].taxrate_id;
      this.productForm.sku = this.productForm.variant_list[0].sku;
      this.productForm.selling_price = this.productForm.variant_list[0].selling_price;
      this.productForm.discounted_price = this.productForm.variant_list[0].discounted_price;
      this.productForm.stock = totalStock;
      // construct variant list
      this.productForm.variant_list.forEach(object => {
        object.stock = parseFloat(object.stock);
        object.selling_price = parseFloat(object.selling_price);
      });
    }
    this.productForm.sku = this.productForm.sku.toUpperCase();
    // addons
    this.productForm.addon_list = [];
    if(this.productForm.addon_status) {
      this.addonList.forEach(object => {
        if(object.addon_checked) this.productForm.addon_list.push({ addon_id: object._id });
      });
    }
    if(!this.productForm.addon_status || !this.addonList.length) this.productForm.addon_must = false;
    // amenities
    this.productForm.amenity_list = [];
    if(this.productForm.amenity_status) {
      this.amenityList.forEach(el => {
        if(el.amen_checked) this.productForm.amenity_list.push(el._id);
      });
    }
    // tag
    this.productForm.tag_list = [];
    if(this.productForm.tag_status) {
      this.tagList.forEach(tagObject => {
        if(tagObject.tag_checked) {
          let optionArray = [];
          tagObject.option_list.forEach(optionObject => {
            if(optionObject.tag_option_checked) optionArray.push(optionObject.name);
          });
          this.productForm.tag_list.push({ [tagObject._id]: optionArray });
        }
      });
    }
    // ai styles
    this.productForm.aistyle_list = [];
    if(this.productForm.aistyle_status) {
      this.aiStyleList.forEach(section => {
        if(section.aistyle_checked) {
          let optionArray = [];
          if(section.type=='either_or') optionArray.push(section.selected_option);
          else {
            section.option_list.forEach(option => {
              if(option.aistyle_option_checked) optionArray.push(option._id);
            });
          }
          this.productForm.aistyle_list.push({ [section._id]: optionArray });
        }
      });
    }
    // foot note
    this.productForm.footnote_list = [];
    if(this.productForm.note_status) {
      this.noteList.forEach(object => {
        if(object.note_checked) this.productForm.footnote_list.push({ name: object.name, value: object.selected_option });
      });
    }
    // faq
    this.productForm.faq_list = [];
    if(this.productForm.faq_status) {
      this.faqList.forEach(faqObject => {
        if(faqObject.faq_checked) {
          this.productForm.faq_list.push({ [faqObject._id]: faqObject.selected_answer });
        }
      });
    }
    if(!this.productForm.availability_status) this.productForm.available_days = [];
    // seo
    let productUrl = this.commonService.urlFormat(this.productForm.name+' '+this.productForm.sku);
    if(!this.productForm.seo_details) this.productForm.seo_details = {};
    if(this.productForm.update_seo) this.productForm.seo_details.modified = false;
    if(productUrl && !this.productForm.seo_details.modified) {
      this.productForm.seo_status = true;
      this.productForm.seo_details.page_url = productUrl;
      this.productForm.seo_details.h1_tag = this.productForm.name.substring(0, 70);
      this.productForm.seo_details.page_title = this.productForm.name.substring(0, 70);
      this.productForm.seo_details.meta_desc = this.commonService.stripHtml(this.productForm.description).substring(0, 320);
    }
    delete this.productForm.category_id;
    delete this.productForm.image_tag_status;
    delete this.productForm.image_list;
    delete this.productForm.video_details;
    let formData = this.productForm;
    if(this.commonService.store_details.login_type=='vendor' && this.commonService.vendor_features.indexOf('update_product_stock_only')!=-1) {
      formData = {
        _id: this.productForm._id, sku: this.productForm.sku, rank: this.productForm.rank, prev_rank: this.productForm.prev_rank, stock: this.productForm.stock,
        variant_status: this.productForm.variant_status, variant_types: this.productForm.variant_types, variant_list: this.productForm.variant_list
      };
    }
    // image tags
    this.productForm.badges = [];
    if(this.productForm.badges_status) {
      this.productForm.badges_list.forEach(object => {
         this.productForm.badges.push(object.value);
      });
    }
    
    // update details
    this.api.UPDATE_PRODUCT(formData).subscribe(result => {
      this.updateDeployStatus();
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate(['/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateImages() {
    this.btnLoader = true;
    if(!this.productForm.image_tag_status) {
      this.productForm.image_list.forEach(obj => { delete obj.tag; });
    }
    let formData: any = {
      _id: this.productForm._id, image_tag_status: this.productForm.image_tag_status,
      image_list: this.productForm.image_list, video_details: this.productForm.video_details,
      variant_status: false, variant_list: [], brochure: this.productForm.brochure
    };
    if(this.productForm.variant_status) {
      formData.variant_status = true;
      if(this.productForm.variant_list) formData.variant_list = this.productForm.variant_list;
    }
    this.api.UPDATE_PRODUCT_IMAGES(formData).subscribe(result => {
      this.updateDeployStatus();
      this.btnLoader = false;
      if(result.status) {
        if(this.brochForm.src) this.onUploadBrocure();
        this.router.navigate(['/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateLink() {
    this.btnLoader = true;
    this.productForm.category_id = [];
    this.categoryList.forEach(element => {
      if(element.selected) this.productForm.category_id.push(element._id);
    });
    let formData = { _id: this.productForm._id, category_id: this.productForm.category_id };
    this.api.UPDATE_PRODUCT_DETAILS(formData).subscribe(result => {
      this.updateDeployStatus();
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate(['/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUploadBrocure() {
    let fileData: FormData = new FormData();
    fileData.append('attachment', this.brochForm.src);
    fileData.append('data', JSON.stringify({ _id: this.productForm._id }));
    this.api.UPLOAD_BROCHURE(fileData).subscribe(result => {
      if(!result.status) console.log("response", result);
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['products']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.products": true };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  adddonListModify(defaultList, addonList) {
    return new Promise((resolve, reject) => {
      this.addonCheckedCount = 0;
      defaultList.forEach(object => {
        let index = addonList.findIndex(x => x.addon_id == object._id);
        if(index != -1) {
          this.addonCheckedCount++;
          object.addon_checked = true;
        }
      });
      resolve(defaultList);
    });
  }

  tagListModify(tagList, productTagList) {
    return new Promise((resolve, reject) => {
      tagList.forEach(tagObject => {
        let tagIndex = productTagList.findIndex(x => Object.keys(x)[0] == tagObject._id);
        if(tagIndex != -1) {
          tagObject.tag_checked = true;
          tagObject.option_list.forEach(optionObject => {
            let optionIndex = productTagList[tagIndex][tagObject._id].findIndex(x => x == optionObject.name);
            if(optionIndex != -1)
              optionObject.tag_option_checked = true;
          });
        }
      });
      resolve(tagList);
    });
  }

  aiStyleModify(styleList, productStyleList) {
    return new Promise((resolve, reject) => {
      styleList.forEach(tagObject => {
        let tagIndex = productStyleList.findIndex(x => Object.keys(x)[0] == tagObject._id);
        if(tagIndex != -1) {
          tagObject.aistyle_checked = true;
          if(productStyleList[tagIndex][tagObject._id]?.length) {
            if(tagObject.type=='either_or') {
              tagObject.selected_option = productStyleList[tagIndex][tagObject._id][0];
            }
            else {
              tagObject.option_list.forEach(optionObject => {
                let optionIndex = productStyleList[tagIndex][tagObject._id].findIndex(x => x == optionObject._id);
                if(optionIndex != -1) optionObject.aistyle_option_checked = true;
              });
            }
          }
        }
      });
      resolve(styleList);
    });
  }

  faqListModify(faqList, productFaqList) {
    return new Promise((resolve, reject) => {
      faqList.forEach(faqObject => {
        let tagIndex = productFaqList.findIndex(x => Object.keys(x)[0] == faqObject._id);
        if(tagIndex != -1) {
          faqObject.faq_checked = true;
          let answerIndex = faqObject.answer_list.findIndex(x => x._id == productFaqList[tagIndex][faqObject._id]);
          if(answerIndex==-1) answerIndex = 0;
          faqObject.selected_answer = faqObject.answer_list[answerIndex]._id;
        }
      });
      resolve(faqList);
    });
  }

  processCategoryList(categoryId) {
    return new Promise((resolve, reject) => {
      this.commonService.catalog_list.forEach(element => {
        element.selected = false;
        if(categoryId.findIndex(x => x == element._id)!=-1) element.selected = true;
      });
      resolve(this.commonService.catalog_list);
    });
  }

  footNoteListModify(tempList, productNoteList) {
    return new Promise((resolve, reject) => {
      tempList.forEach(element => {
        let index = productNoteList.findIndex(object => object.name==element.name);
        if(index!=-1) {
          element.note_checked = true;
          element.selected_option = productNoteList[index].value;
        }
      });
      resolve(tempList);
    });
  }

  /* Common Functions */
  fileChangeListener(index, $event, cropper: ImageCropperComponent) {
    this.imageIndex = index;
    this.productForm.image_list[index].img_change = true;
    let tempImage = new Image();
    let file:File = $event.target.files[0];
    let myReader:FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      tempImage.src = loadEvent.target.result;
      cropper.setImage(tempImage);
    };
    myReader.readAsDataURL(file);
  }
  variantFileChangeListener(parentIndex, childIndex, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.productForm.variant_list[parentIndex].image_list[childIndex].image = (<FileReader>event.target).result;
        this.productForm.variant_list[parentIndex].image_list[childIndex].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  videoFileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let myReader:FileReader = new FileReader();
      myReader.onload = (event: ProgressEvent) => {
        this.productForm.video_details.image = (<FileReader>event.target).result;
        this.productForm.video_details.img_change = true;
      }
      myReader.readAsDataURL(event.target.files[0]);
    }
  }

  selectAllAddons(value) {
    this.addonList.forEach(object => {
      object.addon_checked = value;
    });
  }
  
  discountCalc(x) {
    let discPercentage = 0;
    if(x.disc_percentage && x.disc_percentage!='') discPercentage = x.disc_percentage;
    if(x.variant_types.length) {
      x.variant_list.forEach(object => {
        let sellPrice = 0;
        if(object.selling_price && object.selling_price!='') sellPrice = object.selling_price;
        object.discounted_price = this.discountFormula(sellPrice, discPercentage);
      });
    }
    else {
      let sellPrice = 0;
      if(x.selling_price && x.selling_price!='') sellPrice = x.selling_price;
      x.discounted_price = this.discountFormula(sellPrice, discPercentage);
    }
  }

  discountFormula(price, percentage) {
    let discAmt: any = (price * (percentage/100)).toFixed(2);
    let discountedPrice = 0;
    if(parseFloat(price) >= discAmt) discountedPrice = price - discAmt;
    return discountedPrice;
  }

  onAddColorOptions(modalName) {
    this.selectedVariantOptions = [];
    this.productForm.variant_types[this.selectedVariantIndex].options.forEach(obj => {
      this.selectedVariantOptions.push({display: obj.display});
    });
    if(!this.selectedVariantOptions.length) this.selectedVariantOptions = [{}];
    this.modalService.open(modalName);
  }
  onSetVariantColors() {
    let newOptions = [];
    this.selectedVariantOptions.forEach(obj => {
      if(newOptions.findIndex(el => el.display==obj.display) == -1) newOptions.push({display: obj.display, value: obj.display});
    });
    this.productForm.variant_types[this.selectedVariantIndex].options = newOptions;
    document.getElementById('closeModal').click();
    this.onCreateVariantList(this.productForm.variant_types);
  }

  onChangeVariant(x) {
    this.productForm.variant_list=[];
    if(x) this.productForm.variant_types=[{ options: [] }];
    else this.productForm.variant_types=[];
  }

  onRemoveVariantType(x, index) {
    x.variant_types.splice(index, 1);
    if(!x.variant_types.length) x.variant_status = false;
    this.onCreateVariantList(x.variant_types);
  }

  onCreateVariantList(variantTypes) {
    this.productForm.variant_list = [];
    if(variantTypes.length===1 && variantTypes[0].options.length) {
      this.oneVariant(variantTypes[0])
    }
    else if(variantTypes.length===2) {
      if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
    }
    else if(variantTypes.length===3) {
      if(variantTypes[0].options.length && variantTypes[1].options.length && variantTypes[2].options.length)
        this.threeVariant(variantTypes[0], variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[0], variantTypes[2]);
      else if(variantTypes[1].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
      else if(variantTypes[2].options.length)
        this.oneVariant(variantTypes[2]);
    }
  }

  oneVariant(variantOne) {
    variantOne.options.forEach(objectOne => {
      let jsonData: any = { variants: [objectOne.value], [variantOne.name]: objectOne.value };
      let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value);
      if(varIndex != -1) {
        jsonData.sku = this.existVariantList[varIndex].sku;
        jsonData.stock = this.existVariantList[varIndex].stock;
        jsonData.selling_price = this.existVariantList[varIndex].selling_price;
        jsonData.image_list = [];
        if(this.existVariantList[varIndex].image_list) jsonData.image_list = this.existVariantList[varIndex].image_list;
        if(this.existVariantList[varIndex].discounted_price) jsonData.discounted_price = this.existVariantList[varIndex].discounted_price;
        if(this.existVariantList[varIndex].taxrate_id) jsonData.taxrate_id = this.existVariantList[varIndex].taxrate_id;
        if(!jsonData.taxrate_id && this.primary_tax) jsonData.taxrate_id = this.primary_tax;
      }
      else {
        if(this.primary_tax) jsonData.taxrate_id = this.primary_tax;
        if(this.productForm.sku) jsonData.sku = this.productForm.sku;
      }
      this.productForm.variant_list.push(jsonData);
    });
    this.existVariantList = this.productForm.variant_list;
  }
  twoVariant(variantOne, variantTwo) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        let jsonData: any = { variants: [objectOne.value, objectTwo.value], [variantOne.name]: objectOne.value, [variantTwo.name]: objectTwo.value };
        let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value && obj[variantTwo.name]==objectTwo.value);
        if(varIndex != -1) {
          jsonData.sku = this.existVariantList[varIndex].sku;
          jsonData.stock = this.existVariantList[varIndex].stock;
          jsonData.selling_price = this.existVariantList[varIndex].selling_price;
          jsonData.image_list = [];
          if(this.existVariantList[varIndex].image_list) jsonData.image_list = this.existVariantList[varIndex].image_list;
          if(this.existVariantList[varIndex].discounted_price) jsonData.discounted_price = this.existVariantList[varIndex].discounted_price;
          if(this.existVariantList[varIndex].taxrate_id) jsonData.taxrate_id = this.existVariantList[varIndex].taxrate_id;
          if(!jsonData.taxrate_id && this.primary_tax) jsonData.taxrate_id = this.primary_tax;
        }
        else {
          if(this.primary_tax) jsonData.taxrate_id = this.primary_tax;
          if(this.productForm.sku) jsonData.sku = this.productForm.sku;
        }
        this.productForm.variant_list.push(jsonData);
      });
    });
    this.existVariantList = this.productForm.variant_list;
  }
  threeVariant(variantOne, variantTwo, variantThree) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        variantThree.options.forEach(objectThree => {
          let jsonData: any = { variants: [objectOne.value, objectTwo.value, objectThree.value], [variantOne.name]: objectOne.value, [variantTwo.name]: objectTwo.value, [variantThree.name]: objectThree.value };
          let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value && obj[variantTwo.name]==objectTwo.value && obj[variantThree.name]==objectThree.value);
          if(varIndex != -1) {
            jsonData.sku = this.existVariantList[varIndex].sku;
            jsonData.stock = this.existVariantList[varIndex].stock;
            jsonData.selling_price = this.existVariantList[varIndex].selling_price;
            jsonData.image_list = [];
            if(this.existVariantList[varIndex].image_list) jsonData.image_list = this.existVariantList[varIndex].image_list;
            if(this.existVariantList[varIndex].discounted_price) jsonData.discounted_price = this.existVariantList[varIndex].discounted_price;
            if(this.existVariantList[varIndex].taxrate_id) jsonData.taxrate_id = this.existVariantList[varIndex].taxrate_id;
            if(!jsonData.taxrate_id && this.primary_tax) jsonData.taxrate_id = this.primary_tax;
          }
          else {
            if(this.primary_tax) jsonData.taxrate_id = this.primary_tax;
            if(this.productForm.sku) jsonData.sku = this.productForm.sku;
          }
          this.productForm.variant_list.push(jsonData);
        });
      });
    });
    this.existVariantList = this.productForm.variant_list;
  }

  clearIdValue(idName) {
    let el: any = document.getElementById(idName);
    el.value = "";
  }

  timePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.productForm.available_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }

  onAddCatalog() {
    if(!this.intForm.social_media_status) this.intForm.social_media_links = [];
    if(!this.intForm.content_status) this.intForm.content_details = {};
    this.api.ADD_CATALOG(this.intForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.api.CATALOG_LIST().subscribe(result => {
          if(result.status) {
            this.commonService.catalog_list = result.list;
            this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
            this.commonService.catalog_list.forEach(element => {
              element.selected = false;
              if(this.categoryList.findIndex(obj => obj.selected && obj._id==element._id) != -1) element.selected = true;
            });
            this.categoryList = this.commonService.catalog_list;
          }
          else console.log("response", result);
        });
      }
      else {
        this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onUpdateTag() {
    let newOptionList = []; let selectedTag = this.intForm.selected_tag;
    selectedTag.option_list.forEach(element => { newOptionList.push(element); });
    this.intForm.option_list.forEach(element => { newOptionList.push(element); });
    let formData = {
      _id: selectedTag._id, name: selectedTag.name, rank: selectedTag.rank,
      prev_rank: selectedTag.prev_rank, status: selectedTag.status, option_list: newOptionList
    };
    this.peApi.UPDATE_TAG(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newTagIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newTagIndex!=-1) {
          let updatedOptList = result.list[newTagIndex].option_list;
          updatedOptList.forEach(element => {
            let optIndex = newOptionList.findIndex(obj => obj.tag_option_checked && obj.name==element.name);
            if(optIndex!=-1) element.tag_option_checked = true;
          });
          let tIndex = this.tagList.findIndex(obj => obj._id==formData._id);
          if(tIndex!=-1) this.tagList[tIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  onUpdateNote() {
    let newOptionList = []; let selectedNote = this.intForm.selected_note;
    selectedNote.option_list.forEach(element => { newOptionList.push(element); });
    this.intForm.option_list.forEach(element => { newOptionList.push(element); });
    let formData = {
      _id: selectedNote._id, name: selectedNote.name, rank: selectedNote.rank,
      prev_rank: selectedNote.prev_rank, option_list: newOptionList
    };
    this.peApi.UPDATE_FOOTNOTE(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newNoteIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newNoteIndex!=-1) {
          let updatedOptList = result.list[newNoteIndex].option_list;
          let nIndex = this.noteList.findIndex(obj => obj._id==formData._id);
          if(nIndex!=-1) this.noteList[nIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  handleFileInput(files: FileList) {
    this.productForm.brochure = null;
    this.brochForm.src = files[0];
  }

}