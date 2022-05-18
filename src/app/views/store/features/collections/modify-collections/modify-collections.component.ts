import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { FeaturesApiService } from '../../features-api.service';

@Component({
  selector: 'app-modify-collections',
  templateUrl: './modify-collections.component.html',
  styleUrls: ['./modify-collections.component.scss']
})

export class ModifyCollectionsComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean;
  collectionForm: any; maxRank: any = 0; params: any;
  productList: any = [];

  constructor(
    private api: FeaturesApiService, private storeApi: StoreApiService, private router: Router,
    private activeRoute: ActivatedRoute, public commonService: CommonService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.btnLoader = false;
      this.maxRank = this.params.rank;
      this.collectionForm = { rank: this.maxRank, option_list: [{}] };
      if(this.params.collection_id) {
        this.pageLoader = true;
        this.api.COLLECTION_DETAILS({ _id: this.params.collection_id }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.collectionForm = result.data;
            this.collectionForm.prev_rank = this.collectionForm.rank;
          }
          else console.log("response", result);
        });
      }
    });
    // product list
    this.storeApi.PRODUCT_LIST({ category_id: 'all' }).subscribe(result => {
      if(result.status) this.productList = result.list;
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.btnLoader = true;
    if(this.params.collection_id) {
      this.api.UPDATE_COLLECTION(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/features/collections']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_COLLECTION(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/features/collections']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}