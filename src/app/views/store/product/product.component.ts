import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StoreApiService } from '../../../services/store-api.service';
import { ProductExtrasApiService } from '../product-extras/product-extras-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { DeploymentService } from '../deployment/deployment.service';
import { environment } from '../../../../environments/environment';
import jsonProducts from '../../../../assets/json/products.json';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [SharedAnimations]
})

export class ProductComponent implements OnInit {

  btnLoader: boolean; pageLoader: boolean; globalCount: number = 0;
  totalPages: number = 0; pagesList: any = [];
	page = 1; pageSize = 10;
  list: any = []; totalCount: number = 0;
  filterForm: any = {
    search: "", sort_by: 'created_desc', category_id: 'all',
    vendor_id: 'all', product_type: 'all'
  };
  exportLoader: boolean;
  archiveForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  limitedProdCount = environment.limited_product_count;
  categoryList: any = [{_id: 'all', name: "All Products"}, {_id: 'unlink', name: "Unlinked Products"}]; vendorList: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService, private deployApi: DeploymentService,
    private router: Router, private excelService: ExcelService, public commonService: CommonService, private extraApi: ProductExtrasApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    // vendors
    if(this.commonService.vendor_list.length) {
      this.vendorList = [{_id: 'all', company_details: { brand: "All Vendors" }}];
      this.commonService.vendor_list.forEach(obj => { this.vendorList.push(obj) });
    }
    // catalogs
    if(this.commonService.catalog_list.length) {
      this.commonService.catalog_list.forEach(element => {
        this.categoryList.push(element)
      });
    }
  }

  ngOnInit() {
    this.pageLoader = true; this.page = 1; this.list = [];
    if(this.commonService.vendor_details._id) this.filterForm.vendor_id = this.commonService.vendor_details._id;
    if(this.commonService.product_page_attr) {
      let pageInfo = this.commonService.product_page_attr;
      this.page = pageInfo.page;
      this.filterForm = pageInfo.filter_form;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      delete this.commonService.product_page_attr;
    }
    this.getProductList();
  }

  getProductList() {
    this.filterForm.skip = (this.page-1)*this.pageSize; this.filterForm.limit = this.pageSize;
    this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.totalCount = result.count;
        this.totalPages = Math.ceil(this.totalCount/this.pageSize);
        this.pagesList = new Array(this.totalPages);
        this.globalCount = result.product_count;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onChangePage(type) {
    this.commonService.pageTop(0);
    if(type=='prev') this.page--;
    else this.page++;
    this.getProductList();
  }

  onMoveToArchive() {
    this.storeApi.MOVE_PRODUCT_TO_ARCHIVE(this.archiveForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.archiveForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.btnLoader = true;
    this.storeApi.DELETE_PRODUCT({ _id: this.deleteForm._id, rank: this.deleteForm.rank }).subscribe(result => {
      this.updateDeployStatus();
      setTimeout(() => { this.btnLoader = false; }, 500);
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  importProduct() {
    this.processBeforeImport(jsonProducts).then((prodList) => {
      console.log("-------", prodList);
      // this.storeApi.PRODUCT_BULK_UPLOAD({ product_list: prodList }).subscribe(result => {
      //   console.log("-------result", result);
      // });
    });
  }
  processBeforeImport(list) {
    return new Promise((resolve, reject) => {
      for(let prod of list) {
        if(prod.variant_status) {
          prod.variant_types.forEach(element => {
            element.options = element.options.filter(obj => obj.value!='null');
          });
          prod.variant_list = prod.variant_list.filter(obj => obj.discounted_price!=null);
        }
        prod.category_id = prod.category_id.filter(obj => obj!='null');
        prod.footnote_list = prod.footnote_list.filter(obj => obj.value!='null');
        prod.image_list = prod.image_list.filter(obj => obj.image!='null');
        if(!prod.image_list.length) prod.image_list = [{}];
        let tagList = [];
        prod.tag_list.forEach(obj => {
          for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
              obj[key] = obj[key].filter(obj => obj!='null');
              if(obj[key].length) tagList.push(obj);
            }
          }
        });
        prod.tag_list = tagList;
        if(prod.aistyle_list) {
          prod.aistyle_list.forEach(obj => {
            for(let key in obj) {
              if(obj.hasOwnProperty(key)) obj[key] = obj[key].filter(obj => obj!='null');
            }
          });
        }
      }
      resolve(list);
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

  goModifyPage(product, stepNum) {
    this.commonService.product_page_attr = { page: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/products/modify/"+product._id+"/"+this.globalCount+"/"+stepNum]);
  }
  goReviewPage(x) {
    this.commonService.product_page_attr = { page: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/features/selected-product-reviews/"+x._id]);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    delete this.filterForm.skip; delete this.filterForm.limit;
    this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
      if(result.status) {
        this.createList(this.commonService.catalog_list, result.list).then((exportList: any[]) => {
          this.excelService.exportAsExcelFile(exportList, 'product'+' export '+new Date().getTime());
          setTimeout(() => { this.exportLoader = false; }, 500);
        });
      }
      else {
        console.log("response", result);
        setTimeout(() => { this.exportLoader = false; }, 500);
      }
    });
  }
  async createList(overallCategoryList, productList) {
    let updatedList = [];
    for(let i=0; i<productList.length; i++) {
      let sendData = {};
      sendData['Name'] = productList[i].name;
      sendData['SKU'] = productList[i].sku;
      sendData['Price'] = productList[i].discounted_price;
      sendData['Stock'] = productList[i].stock;
      sendData['URL'] = this.commonService.store_details.base_url+'/product/'+productList[i].seo_details.page_url;
      sendData['Description'] = productList[i].description;
      sendData['Category'] = await this.processArrayList('category', overallCategoryList, productList[i].category_id);
      sendData['Image'] = await this.processArrayList('image', overallCategoryList, productList[i].image_list);
      updatedList.push(sendData);
    }
    return updatedList;
  }
  processArrayList(type, overallCategoryList, list) {
    return new Promise((resolve, reject) => {
      let respData = "";
      if(type=="category") {
        for(let i=0; i<list.length; i++) {
          let index = overallCategoryList.findIndex(obj => obj.section_id==list[i] || obj.category_id==list[i] || obj._id==list[i]);
          if(index!=-1) respData += overallCategoryList[index].name+", ";
        }
      }
      else if(type=="image") {
        for(let i=0; i<list.length; i++) {
          respData += this.imgBaseUrl+list[i].image+", ";
        }
      }
      resolve(respData.substring(0, respData.length-2));
    });
  }

}