import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionGuard implements CanActivate {

  constructor(private router : Router, private commonService: CommonService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let routeData = next.data;
    if(localStorage.getItem('store_token')) {
      if(this.commonService.route_permission_list.includes(routeData.name)) return true;
      else return false;
    }
    else {
      this.commonService.clearData();
      this.router.navigate(['/session/signin']);
      return false;
    }
  }

}