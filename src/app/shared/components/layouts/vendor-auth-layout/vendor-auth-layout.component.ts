import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-vendor-auth-layout',
  templateUrl: './vendor-auth-layout.component.html',
  styleUrls: ['./vendor-auth-layout.component.scss']
})

export class VendorAuthLayoutComponent implements OnInit {

  pageLoader: boolean;

  constructor(private router: Router, public commonService: CommonService, private cookieService: CookieService, private api: ApiService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    let storeSplit = this.router.url.split('/');
    let storeName = storeSplit[storeSplit.length-1];
    if(storeName) {
      if(this.cookieService.check('vInfo'))
      {
        let vInfo = JSON.parse(this.cookieService.get('vInfo'));
        if(vInfo.name == storeName) {
          this.commonService.vendor_login_info = vInfo;
          this.pageLoader = false;
        }
        else this.getDomainInfo(storeName);
      }
      else this.getDomainInfo(storeName);
    }
  }

  getDomainInfo(storeName) {
    this.api.DOMAIN_INFO(storeName).subscribe(result => {
      if(result.status) {
        let storeLogo = "https://yourstore.io/api/uploads/"+result.data._id+"/logo.png?v="+new Date().valueOf();
        let bgColor = result.data.theme_colors.primary;
        if(result.data.theme_colors.vendor_bg) bgColor = result.data.theme_colors.vendor_bg;
        let vInfo = { id: result.data._id, name: result.data.sub_domain, logo: storeLogo, bg_color: bgColor };
        this.commonService.vendor_login_info = vInfo;
        const cDate = new Date();
        cDate.setHours(cDate.getHours() + 12);
        this.cookieService.set('vInfo', JSON.stringify(vInfo), cDate);
        setTimeout(() => { this.pageLoader = false; }, 500);
      }
      else console.log("response", result);
    });
  }

}