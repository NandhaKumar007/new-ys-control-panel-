import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StoreApiService {

  constructor(private http: HttpClient) { }

  // dashboard
  DASHBOARD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/dashboard', x, httpOptions);
  }
  DASHBOARD_CUSTOMERS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/dashboard_customers', x, httpOptions);
  }
  VENDOR_DASHBOARD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/vendor_dashboard', x, httpOptions);
  }

  // store
  STORE_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/details', httpOptions);
  }
  ADV_STORE_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/adv_details', httpOptions);
  }
  STORE_UPDATE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/details', x, httpOptions);
  }
  STORE_PROPERTY_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/properties', httpOptions);
  }
  UPDATE_STORE_PROPERTY_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/properties', x, httpOptions);
  }
  DOMAIN_ENQUIRY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/domain_enquiry', x, httpOptions);
  }
  CHANGE_PWD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/change_pwd', x, httpOptions);
  }
  CREATE_SSL() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/create_ssl', httpOptions);
  }

  // product
  PRODUCT_LIST(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/product_list', x, httpOptions);
  }
  PRODUCTS_COUNT() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/product_list', httpOptions);
  }
  MULTI_PRODUCTS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/multi_product_list', x, httpOptions);
  }
  PRODUCT_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/product/'+x, httpOptions);
  }
  ADD_PRODUCT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/product', x, httpOptions);
  }
  UPDATE_PRODUCT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/product', x, httpOptions);
  }
  UPDATE_PRODUCT_IMAGES(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/product/images', x, httpOptions);
  }
  UPDATE_PRODUCT_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/product/details', x, httpOptions);
  }
  UPLOAD_BROCHURE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/product/brochure', x, httpOptions);
  }
  DELETE_PRODUCT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/product', x, httpOptions);
  }
  MOVE_PRODUCT_TO_ARCHIVE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/product/archive', x, httpOptions);
  }
  PRODUCT_BULK_UPLOAD(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/product_bulk_upload', x, httpOptions);
  }

  // catalog
  CATALOG_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/catalog', httpOptions);
  }
  CATALOG_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/catalog/details', x, httpOptions);
  }
  ADD_CATALOG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/catalog', x, httpOptions);
  }
  UPDATE_CATALOG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/catalog', x, httpOptions); 
  }
  DELETE_CATALOG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/catalog', x, httpOptions);
  }

  // layouts
  LAYOUT_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/layout', httpOptions);
  }
  ADD_LAYOUT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/layout', x, httpOptions);
  }
  LAYOUT_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/layout?layout_id='+x, httpOptions);
  }
  UPDATE_LAYOUT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/layout', x, httpOptions);
  }
  DELETE_LAYOUT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/layout', x, httpOptions);
  }
  UPDATE_LAYOUT_LIST(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/layout_list_v2', x, httpOptions);
  }
  RESET_LAYOUT() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/layout_list', {}, httpOptions);
  }

  // features
  PRODUCT_FEATURES() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/product_features', httpOptions);
  }
  STORE_FEATURES() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/store_features', httpOptions);
  }

  // donation
  DONATION_LIST(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/donation_list', x, httpOptions);
  }

  // feedback
  FEEDBACK(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/feedback', x, httpOptions);
  }

  // subscribers
  SUBSCRIBER_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/newsletter_subscribers', httpOptions);
  }

  UPDATE_LOGO(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/update_logo', x, httpOptions);
  }

}