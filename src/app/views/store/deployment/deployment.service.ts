import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DeploymentService {

  constructor(private http: HttpClient) { }

  DEPLOY_DETAILS(storeId) { return this.http.get<any>(environment.ws_url+'/others/deploy?store_id='+storeId); }
  UPDATE_DEPLOY_DETAILS(x) { return this.http.put<any>(environment.ws_url+'/others/deploy', x); }

  PACKAGE_LIST(x) { return this.http.get<any>(environment.ws_url+'/others/packages?package_id='+x); }
  PURCHASE_PLAN(x) { return this.http.post<any>(environment.ws_url+'/others/plan', x); }
  CHANGE_PLAN(x) { return this.http.put<any>(environment.ws_url+'/others/plan', x); }

  UPDATE_STORE_LOGO(x) { return this.http.post<any>(environment.ws_url+'/logo_upload', x); }
  LOGO_COLORS(x) { return this.http.post<any>(environment.ws_url+'/logo_colors', x); }

  BILLING_DETAILS(x) { return this.http.post<any>(environment.ws_url+'/others/billing_details', x); }
  BILLING_STMT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/billing_statement', x, httpOptions);
  }

}