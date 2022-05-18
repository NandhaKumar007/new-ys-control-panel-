import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { ExcelService } from '../../../../../services/excel.service';
import { FieldSearchPipe } from '../../../../../shared/pipes/field-search.pipe';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-archive-products',
  templateUrl: './archive-products.component.html',
  styleUrls: ['./archive-products.component.scss'],
  animations: [SharedAnimations]
})

export class ArchiveProductsComponent implements OnInit {

  page = 1; pageSize = 10; exportLoader: boolean;
  list: any = []; archive_list: any = [];
  archiveForm: any; selectedProduct: any;
  deleteForm: any; params: any;
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private storeApi: StoreApiService,
    private api: ProductExtrasApiService, private excelService: ExcelService, private datePipe: DatePipe, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.archive_list = this.commonService.archive_list.filter(obj => obj._id!=this.params.archive_id);
      this.productList();
    });
  }

  productList() {
    this.api.ARCHIVE_PRODUCTS(this.params.archive_id).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // move
  onInterchange() {
    this.archiveForm.product_id = this.selectedProduct._id;
    this.api.MOVE_PRODUCT_FROM_ARCHIVE(this.archiveForm).subscribe(result => {
      if(result.status) {
        document.getElementById("closeModal").click();
        this.productList();
      }
      else {
				this.archiveForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.storeApi.DELETE_PRODUCT({ _id: this.deleteForm._id, rank: this.deleteForm.rank }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.productList();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let productList = new FieldSearchPipe().transform(this.list, 'name', this.search_bar);
    this.createList(this.commonService.catalog_list, productList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, 'Archive-'+this.params.archive_name+'-'+this.datePipe.transform(new Date(), 'dd MMM y'));
      setTimeout(() => { this.exportLoader = false; }, 500);
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
          respData += environment.img_baseurl+list[i].image+", ";
        }
      }
      resolve(respData.substring(0, respData.length-2));
    });
  }

}