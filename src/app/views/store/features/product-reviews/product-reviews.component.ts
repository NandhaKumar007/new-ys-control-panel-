import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss'],
  animations: [SharedAnimations]
})

export class ProductReviewsComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10; list: any = [];
  filterForm: any = {};
  imgBaseUrl = environment.img_baseurl;
  configData: any = environment.config_data;

  constructor(private api: FeaturesApiService, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("review_filter")) {
      this.filterForm = JSON.parse(localStorage.getItem("review_filter"));
      this.filterForm.from_date = new Date(this.filterForm.from_date);
      this.filterForm.to_date = new Date(this.filterForm.to_date);
      localStorage.removeItem("review_filter");
    }
    else this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: 'all', search_bar: "" };
    this.getReviewProducts();
  }

  getReviewProducts() {
    if(this.commonService.store_details?.package_details?.package_id==this.configData.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else {
      this.pageLoader = true;
      this.api.REVIEWED_PRODUCT_LIST(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.product_sku = obj.productDetails[0].sku;
            obj.product_name = obj.productDetails[0].name;
          });
        }
        else console.log("response", result);
      });
    }
  }

  onSelect(x) {
    localStorage.setItem("review_filter", JSON.stringify(this.filterForm));
    this.router.navigate(["/features/product-reviews/"+x._id]);
  }

}