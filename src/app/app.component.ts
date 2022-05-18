import { Component, HostListener } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from './services/common.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  @HostListener('window:scroll', ['$event'])
  getScrollPosition() {
    this.commonService.scroll_y_pos = window.pageYOffset;
    this.commonService.screen_width = window.innerWidth;
  }

  constructor(private router: Router, config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private deviceService: DeviceDetectorService) {
    config.backdrop = 'static'; config.keyboard = false;
    this.getScrollPosition();
    if(localStorage.getItem("darkSwitch")) {
      this.commonService.dark_theme = true;
      document.body.setAttribute("data-theme", "true");
    }
    // device type
    if(this.deviceService.isDesktop()) this.commonService.desktop_device = true;
    let iosPlatforms = ["iPad", "iPhone", "iPod", "iPod touch"];
    if(iosPlatforms.indexOf(navigator.platform) != -1) this.commonService.ios = true;
  }

  ngOnInit() {
    if(environment.keep_login) {
      LocalNotifications.requestPermissions().then(result => {
        console.log('local', result);
      });

      PushNotifications.requestPermissions().then(result => {
        if(result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('valllllllllll', token.value);
        sessionStorage.setItem("app_token", token.value);
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push received: ' +notification); 
        this.schedule(notification);
      });

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        this.commonService.notification_url = notification.notification.data.url;
          document.getElementById("mybtn").click();
      });
    }
  }

  schedule(notification) {
    const randomId = Math.floor(Math.random() * 10000) + 1;
    LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title,
          body: notification.body,
          largeBody : notification.body,
          id: randomId,
          smallIcon: 'ic_stat_ys_icon', 
          largeIcon : 'ic_stat_ys_icon_large', 
          extra:{url : notification.data.url}    
          // attachments: [
          //   { id: 'face', url: 'https://khanoo.com/wp-content/uploads/estate_images/house/77-1576179614/230174.jpg' ,options:{}}
          // ],
          // schedule: {
          //   at: new Date(new Date().getTime()+60*10000),
          //   repeats: false
          // }
        }
      ]
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
        console.log('payloaddddd', payload.notification.extra.url);
        this.commonService.notification_url = payload.notification.extra.url; 
        document.getElementById("mybtn").click();  
    });
  }

  testNotify() {
    this.router.navigate([this.commonService.notification_url]);
  }

}