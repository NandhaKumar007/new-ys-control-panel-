import { Component, OnInit } from '@angular/core';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deploy-domain',
  templateUrl: './deploy-domain.component.html',
  styleUrls: ['./deploy-domain.component.scss']
})

export class DeployDomainComponent implements OnInit {

  domainForm: any;
  providerList: any = [
    { name: "GoDaddy" },
    { name: "Namecheap" },
    { name: "Hostgator" },
    { name: "Cloudflare" },
    { name: "Big Rock" },
    { name: "ResellerClub" },
    { name: "Bluehost" },
    { name: "Domain.com" },
    { name: "Google Domains" },
    { name: "Enom" },
    { name: "Others" }
  ];
  configData: any = environment.config_data;

  constructor(public commonService: CommonService, private storeApi: StoreApiService) { }

  ngOnInit(): void {
    this.domainForm = { provider: '', form_type: 'buy_domain' };
    if(localStorage.getItem("connect_domain")) this.domainForm = JSON.parse(localStorage.getItem("connect_domain"));
    if(this.commonService.store_details?.package_details?.package_id==this.configData.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
  }

  onSubmit() {
    if(!this.domainForm.success) {
      this.domainForm.submit = true;
      let formData = { form_type: this.domainForm.form_type, provider: this.domainForm.provider, domain: this.domainForm.domain };
      if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
      if(formData.form_type == "buy_domain") delete formData.provider;
      this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
        delete this.domainForm.submit;
        this.domainForm.success = true;
        localStorage.setItem("connect_domain", JSON.stringify(this.domainForm));
        if(!result.status) console.log("response", result);
      });
    }
  }

}