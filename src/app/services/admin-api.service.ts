import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AdminApiService {

  constructor(private http: HttpClient) { }

  YS_CURRENCY_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/others/ys_currency_list', httpOptions);
  }
  GENERATE_STORE_TOKEN(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/generate_token_v2', x, httpOptions);
  }
  DASHBOARD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/dashboard', x, httpOptions);
  }

  // clients
  STORE_LIST(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/store?'+x, httpOptions);
  }
  UPDATE_STORE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/store', x, httpOptions); 
  }
  DELETE_STORE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.patch<any>(environment.ws_url+'/admin/store', x, httpOptions); 
  }
  SEND_NOTIFICATION(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/send_notification', x, httpOptions);
  }
  STORE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/details', x, httpOptions);
  }
  CHANGE_STORE_PWD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/store/change_pwd', x, httpOptions);
  }
  MANUAL_DEPLOY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/store/manual_deploy?store_id='+x, httpOptions);
  }
  CHECK_BUILD_STATUS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/store/check_build_status?store_id='+x, httpOptions);
  }

  // packages
  PACKAGE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/packages', httpOptions);
  }
  ADD_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/packages', x, httpOptions);
  }
  UPDATE_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/packages', x, httpOptions); 
  }
  DELETE_PACKAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.patch<any>(environment.ws_url+'/admin/packages', x, httpOptions);
  }

  // features
  FEATURE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/features', httpOptions);
  }
  FEATURE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/features/details', x, httpOptions);
  }
  ADD_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/features', x, httpOptions);
  }
  UPDATE_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.put<any>(environment.ws_url+'/admin/features', x, httpOptions); 
  }
  DELETE_FEATURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.patch<any>(environment.ws_url+'/admin/features', x, httpOptions);
  }

  // subscribers
  SUBSCRIBER_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.get<any>(environment.ws_url+'/admin/subscribers', httpOptions);
  }

  // payments
  PAYMENTS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('master_token') }) };
    return this.http.post<any>(environment.ws_url+'/admin/payment_list', x, httpOptions);
  }

}