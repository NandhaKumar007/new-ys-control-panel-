import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [SharedAnimations]
})

export class SignupComponent implements OnInit {

  signupForm: any; params: any; queryParams: any;
  step: number = 1; stateList: any = [];
  currencyList: any = [
    { "country_code": "INR", "html_code": "&#x20B9;" },
    { "country_code": "USD", "html_code": "&#36;" },
    { "country_code": "AUD", "html_code": "A&#36;" },
    { "country_code": "AED", "html_code": "AED" }
  ];
  
  constructor(public router: Router, private activeRoute: ActivatedRoute, private api: ApiService, public commonService: CommonService) {
    this.signupForm = {
      country: "India", currency_types: this.currencyList[0],
      company_details: { dial_code: "+91", state: "" }, category: "", type: ""
    };
    if(environment.keep_login) this.signupForm.signup_from = "app";
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
        this.onCountryChange(this.signupForm.country);
      });
    }
    else this.onCountryChange(this.signupForm.country);
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((queryParams: Params) => {
      this.queryParams = queryParams;
      this.activeRoute.params.subscribe((params: Params) => { this.params = params; });
    });
    this.commonService.loadChat();
  }

  onSubmit() {
    this.signupForm.submit = true;
    this.signupForm.company_details.name = this.signupForm.name;
    if(this.router.url.indexOf('/pro') != -1) this.signupForm.ys_category = 'pro';
    if(this.params.service) {
      let sIndex = this.commonService.ys_services.findIndex(obj => obj.short_name==this.params.service);
      if(sIndex!=-1) this.signupForm.type = this.commonService.ys_services[sIndex].name;
    }
    if(!this.signupForm.type) delete this.signupForm.type;
    this.signupForm.query_params = this.queryParams;
    if(sessionStorage.getItem("app_token")) this.signupForm.app_token = sessionStorage.getItem("app_token");
    sessionStorage.setItem('formData', JSON.stringify(this.signupForm));
    this.api.SIGNUP(this.signupForm).subscribe(result => {
      if(result.status == true) this.router.navigate(['/welcome/created']);
      else {
        console.log("response", result);
        this.signupForm.errorMsg = result.message;
      }
      setTimeout(() => { this.signupForm.submit = false; }, 500);
    });
  }

  prevStep() {
    delete this.signupForm.submit;
    delete this.signupForm.errorMsg;
    this.step--;
  }
  nextStep() {
    delete this.signupForm.submit;
    delete this.signupForm.errorMsg;
    this.step++;
  }

  validateEmail(x) {
    this.signupForm.submit = true;
    this.api.VALIDATE_EMAIL({ email: x }).subscribe(result => {
      if(result.status == true) this.nextStep();
      else {
        console.log("response", result);
        this.signupForm.errorMsg = result.message;
      }
      setTimeout(() => { this.signupForm.submit = false; }, 500);
    });
  }

  onCountryChange(x) {
    this.stateList = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) this.stateList = this.commonService.country_list[index].states;
  }

  ngOnDestroy() {
    this.commonService.hideChat();
  }

}