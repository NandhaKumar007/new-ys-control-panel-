import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  animations: [SharedAnimations]
})

export class NewsletterComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.pageLoader = true;
    this.api.SUBSCRIBER_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}