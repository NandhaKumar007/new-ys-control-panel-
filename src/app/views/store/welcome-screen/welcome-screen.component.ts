import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})

export class WelcomeScreenComponent implements OnInit {

  interval: any; timer: number = 5;
  formData: any; params: any = {};

  constructor(public router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.params.type=='activated') {
        this.interval = setInterval(() => {
          this.timer--;
          if(this.timer===0) {
            clearInterval(this.interval);
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      }
      else if(this.params.type=='created') {
        if(sessionStorage.getItem("formData")) {
          this.formData = JSON.parse(sessionStorage.getItem("formData"));
          this.loadGTM('GTM-TNLBPXF');
          this.loadFbPixel('682484672530329');
        }
        else this.router.navigate(['/']);
      }
      else this.router.navigate(['/']);
    });
  }

  loadGTM(trackingID: string): void {
    let gaScript1 = document.createElement('script');
    gaScript1.innerText = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})";
    gaScript1.innerText += `(window,document,\'script\',\'dataLayer\',\'${ trackingID }\');`;

    document.documentElement.firstChild.appendChild(gaScript1);

    let fbScript2 = document.createElement('noscript');
    let frameElem: any = document.createElement('iframe');
    frameElem.height = 0; frameElem.width = 0; frameElem.style.display = "none"; frameElem.style.visibility = "hidden";
    frameElem.src = "https://www.googletagmanager.com/ns.html?id="+trackingID;
    fbScript2.appendChild(frameElem);

    document.body.appendChild(fbScript2);
  }

  loadFbPixel(trackingID: string): void {
    let fbScript1 = document.createElement('script');
    fbScript1.innerText = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');";
    fbScript1.innerText += `fbq(\'init\', \'${ trackingID }\');`;
    fbScript1.innerText += `fbq(\'track\', \'PageView\');`;

    let fbScript2 = document.createElement('noscript');
    let imgElem = document.createElement('img');
    imgElem.height = 1; imgElem.width = 1; imgElem.style.display = "none";
    imgElem.src = "https://www.facebook.com/tr?id="+trackingID+"&ev=PageView&noscript=1";
    fbScript2.appendChild(imgElem);

    document.documentElement.firstChild.appendChild(fbScript1);
    document.documentElement.firstChild.appendChild(fbScript2);
  }

  ngOnDestroy() {
    if(this.interval) clearTimeout(this.interval);
  }

}