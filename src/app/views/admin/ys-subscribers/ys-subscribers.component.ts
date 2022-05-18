import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-subscribers',
  templateUrl: './ys-subscribers.component.html',
  styleUrls: ['./ys-subscribers.component.scss'],
  animations: [SharedAnimations]
})
export class YsSubscribersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];

  constructor(private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.pageLoader = true;
    this.adminApi.SUBSCRIBER_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}