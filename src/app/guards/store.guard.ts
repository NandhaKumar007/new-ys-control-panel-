import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})

export class StoreGuard implements CanActivate {

  constructor(private router : Router, private commonService: CommonService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(localStorage.getItem('store_token')) {
      return true;
    }
    else {
      this.commonService.clearData();
      this.router.navigate(['/session/signin']);
      return false;
    }
  }

}