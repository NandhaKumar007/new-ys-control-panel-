import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-vs-order-details',
  templateUrl: './vs-order-details.component.html',
  styleUrls: ['./vs-order-details.component.scss']
})

export class VsOrderDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {};
  pageLoader: boolean; itemList: any = [];
  vendorInfo: any = {}; vendorDetails: any = {};
  imgBaseUrl = environment.img_baseurl;
  cmsn_config: any = {};

  constructor(
    private activeRoute: ActivatedRoute, private api: OrderService, public commonService: CommonService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.pageLoader = true;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          this.itemList = this.order_details.item_list.filter(obj => obj.vendor_id==this.params.vendor_id);
          let vendorIndex = this.order_details.vendor_list.findIndex(obj => obj.vendor_id==this.params.vendor_id);
          if(vendorIndex!=-1) this.vendorInfo = this.order_details.vendor_list[vendorIndex];
          // vendor details
          let vIndex = this.commonService.vendor_list.findIndex(el => el._id==this.params.vendor_id);
          if(vIndex!=-1) this.vendorDetails = this.commonService.vendor_list[vIndex];
          // calculate commission
          this.vendorInfo.commission_tax = 0;
          let priceRange = this.commonService.deploy_details.price_range.sort((a, b) => 0 - (a.price > b.price ? -1 : 1));
          this.vendorInfo.total_commission = this.vendorInfo.shipping_method?.dp_charges;
          this.cmsn_config = this.commonService.deploy_details.cmsn_config;
          if(this.commonService.deploy_details.cmsn_type=='flat') {
            let cmsnPercent = (this.commonService.deploy_details.cmsn_in_pct/100);
            this.vendorInfo.items_commission = Math.ceil(this.vendorInfo.sub_total*cmsnPercent);
            this.contCalc();
          }
          else if(this.commonService.deploy_details.cmsn_type=='order_range' && priceRange.length) {
            let prIndex = priceRange.findIndex(obj => obj.price > this.vendorInfo.sub_total);
            if(prIndex==-1) prIndex = priceRange.length - 1;
            else prIndex--;
            let cmsnPercent = (priceRange[prIndex].percentage/100);
            this.vendorInfo.items_commission = Math.ceil(this.vendorInfo.sub_total*cmsnPercent);
            this.contCalc();
          }
          else if(this.commonService.deploy_details.cmsn_type=='product_range' && priceRange.length) {
            this.calcItemsCmsn(this.itemList, priceRange).then((itemsCmsn) => {
              this.vendorInfo.items_commission = itemsCmsn;
              this.contCalc();
            });
          }
          // settlement date
          let settleDate = this.vendorInfo[this.cmsn_config.settlem_type];
          this.vendorInfo.settlement_on = new Date(settleDate).setDate(new Date(settleDate).getDate() + this.cmsn_config.settlem_in_days);
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  calcItemsCmsn(itemList, priceRange) {
    return new Promise((resolve, reject) => {
      let totalCommission = 0;
      for(let item of itemList)
      {
        let prIndex = priceRange.findIndex(obj => obj.price > item.discounted_price);
        if(prIndex==-1) prIndex = priceRange.length - 1;
        else prIndex--;
        let cmsnPercent = (priceRange[prIndex].percentage/100);
        let finalPrice = 0;
        if(item.unit=='Pcs') finalPrice = (item.final_price*item.quantity);
        else finalPrice = ((item.final_price*item.quantity)+item.addon_price);
        totalCommission += Math.ceil(finalPrice*cmsnPercent);
      }
      resolve(totalCommission);
    });
  }

  contCalc() {
    this.vendorInfo.total_commission += this.vendorInfo.items_commission;
    // payment gateway charges
    if(this.order_details.payment_details?.name!='COD' && this.cmsn_config.pgw_charges>0) {
      let pgCharges = (this.cmsn_config.pgw_charges/100);
      this.vendorInfo.pg_charges = Math.ceil(this.vendorInfo.grand_total*pgCharges);
      this.vendorInfo.total_commission += this.vendorInfo.pg_charges;
    }
    // tax on commission
    if(this.cmsn_config.tax_on_cmsn && this.cmsn_config.tax_in_pct>0) {
      let cmsnTax = (this.cmsn_config.tax_in_pct/100);
      this.vendorInfo.commission_tax = Math.ceil(this.vendorInfo.total_commission*cmsnTax);
    }
  }

}