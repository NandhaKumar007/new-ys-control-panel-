import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { SidebarService, IMenuItem } from '../../../../services/sidebar.service';
import { Utils } from './../../../animations/utils';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit {

  moduleLoading: boolean;
  notifications: any[];
  selectedItem: IMenuItem;
  nav: IMenuItem[];
  currentYear: any = (new Date()).getFullYear();
  imgBaseUrl = environment.img_baseurl;

  constructor(private router: Router, public navService: SidebarService, public commonService: CommonService) {
    this.notifications = [
      {
        icon: "message",
        title: "New message",
        badge: "3",
        text: "James: Hey! are you busy?",
        time: new Date(),
        status: "primary",
        link: "/chat"
      },
      {
        icon: "i-Receipt-3",
        title: "New order received",
        badge: "$4036",
        text: "1 Headphone, 3 iPhone x",
        time: new Date("11/11/2018"),
        status: "success",
        link: "/tables/full"
      },
      {
        icon: "i-Empty-Box",
        title: "Product out of stock",
        text: "Headphone E67, R98, XL90, Q77",
        time: new Date("11/10/2018"),
        status: "danger",
        link: "/tables/list"
      },
      {
        icon: "i-Data-Power",
        title: "Server up!",
        text: "Server rebooted successfully",
        time: new Date("11/08/2018"),
        status: "success",
        link: "/dashboard/v2"
      },
      {
        icon: "i-Data-Block",
        title: "Server down!",
        badge: "Resolved",
        text: "Region 1: Server crashed!",
        time: new Date("11/06/2018"),
        status: "danger",
        link: "/dashboard/v3"
      }
    ];
  }

  ngOnInit() {
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(routeChange => {
      this.closeChildNav();
      if(Utils.isMobile()) { this.navService.sidebarState.sidenavOpen = false; }
    });
    this.nav = [
      { name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/admin/dashboard' },
      { name: 'Currencies', type: 'link', icon: 'attach_money', state: '/admin/currencies' },
      { name: 'Packages', type: 'link', icon: 'fact_check', state: '/admin/packages' },
      { name: 'Apps', type: 'link', icon: 'extension', state: '/admin/features' },
      { name: 'Clients', type: 'link', icon: 'supervised_user_circle', state: '/admin/clients' },
      { name: 'Dealers', type: 'link', icon: 'group', state: '/admin/dealers' },
      { name: 'Payments', type: 'dropDown', icon: 'receipt_long', sub: [
        { icon: 'receipt_long', name: 'Payments', state: '/admin/payments/active', type: 'link' },
        { icon: 'receipt_long', name: 'Inactive Payments', state: '/admin/payments/inactive', type: 'link' }
      ] },
      { name: 'Subscribers', type: 'link', icon: 'mail', state: '/admin/subscribers' }
    ];
    this.setActiveFlag();
  }

  selectItem(item) {
    this.navService.sidebarState.childnavOpen = true;
    this.selectedItem = item;
    this.setActiveMainItem(item);
  }
  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
    this.setActiveFlag();
  }

  onClickChangeActiveFlag(item) {
    this.setActiveMainItem(item);
  }
  setActiveMainItem(item) {
    this.nav.forEach(item => { item.active = false; });
    item.active = true;
  }

  setActiveFlag() {
    if(window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      this.nav.forEach(item => {
        item.active = false;
        if(activeRoute.indexOf(item.state) !== -1) {
          this.selectedItem = item;
          item.active = true;
        }
        if(item.sub) {
          item.sub.forEach(subItem => {
            subItem.active = false;
            if(activeRoute.indexOf(subItem.state) !== -1) {
              this.selectedItem = item;
              item.active = true;
            }
            if(subItem.sub) {
              subItem.sub.forEach(subChildItem => {
                if(activeRoute.indexOf(subChildItem.state) !== -1) {
                  this.selectedItem = item;
                  item.active = true;
                  subItem.active = true;
                }
              });
            }
          });
        }
      });
    }
  }

  updateSidebar() {
    if(Utils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    }
    else {
      this.navService.sidebarState.sidenavOpen = true;
    }
  }
  toggelSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = !state.sidenavOpen;
    state.childnavOpen = false;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateSidebar();
  }
  
}