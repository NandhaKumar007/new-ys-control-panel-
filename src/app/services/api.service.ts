import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  // AUTH
  VALIDATE_EMAIL(x) { return this.http.post<any>(environment.ws_url+'/others/check_email', x); }
  SIGNUP(x) { return this.http.post<any>(environment.ws_url+'/others/create_store', x); }

  LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/login_v2', x); }
  FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/forgot_request', x); }
  VALIDATE_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/validate_forgot_request', x); }
  UPDATE_PWD(x) { return this.http.post<any>(environment.ws_url+'/auth/store/update_pwd', x); }

  VENDOR_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/vendor_login', x); }
  VENDOR_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/vendor_forgot_request', x); }
  VALIDATE_VENDOR_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/validate_vendor_forgot_request', x); }
  UPDATE_VENDOR_PWD(x) { return this.http.post<any>(environment.ws_url+'/auth/store/update_vendor_pwd', x); }

  MASTER_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/admin/login', x); }

  // common
  COUNTRIES_LIST() { return this.http.get<any>(environment.ws_url+'/store_details/country_list'); }
  DOMAIN_INFO(x) { return this.http.get<any>(environment.ws_url+'/store_details/domain_details?dom_id='+x); }

}