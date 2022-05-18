import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { SidebarService, IMenuItem } from '../../../../services/sidebar.service';
import { Utils } from './../../../animations/utils';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.scss']
})

export class StoreLayoutComponent implements OnInit {

  notifications: any[];
  selectedItem: IMenuItem;
  currentYear: any = (new Date()).getFullYear();
  imgBaseUrl = environment.img_baseurl;
  audio: any; keepLogin: boolean = environment.keep_login;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private swPush: SwPush, private router: Router,
    public navService: SidebarService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
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
    // push notification
    if(!environment.keep_login && this.swPush.isEnabled) {
      this.swPush.messages.subscribe( event => { console.log("receive notification"); this.playAudio(); });
      // this.swPush.notificationClicks.subscribe( event => { });
    }
  }

  playAudio() {
    if(!document.getElementById("newOrderModalContent")) {
      this.audio = document.getElementById("audio-file");
      this.audio.play();
      this.audio.loop = true;
      document.getElementById("openNewOrderModal").click();
    }
  }
  stopAudio() {
    this.audio = document.getElementById("audio-file");
    this.audio.pause();
  }

  ngOnInit() {
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(routeChange => {
      this.closeChildNav();
      if(Utils.isMobile()) { this.navService.sidebarState.sidenavOpen = false; }
    });
    this.navService.getSidePanelList();
    if(this.navService.sidePanelList.length) this.setActiveFlag();
    else this.navService.sidebarState.sidenavOpen = false;
  }

  signOut() {
    if(this.commonService.store_details?.login_type=='vendor') {
      this.commonService.signOut('/vendor/signin/'+this.commonService.store_details?.sub_domain);
    }
    else this.commonService.signOut('/session/signin');
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
    this.navService.sidePanelList.forEach(item => { item.active = false; });
    item.active = true;
  }

  setActiveFlag() {
    if(window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      this.navService.sidePanelList.forEach(item => {
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