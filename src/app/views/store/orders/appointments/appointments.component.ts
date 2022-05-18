import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../order.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  animations: [SharedAnimations]
})

export class AppointmentsComponent implements OnInit {

  pageLoader: boolean; search_bar: string; exportLoader: boolean;
  page = 1; pageSize = 10;
  params: any = {}; filterForm: any = {};
  parentList: any = []; list: any = []; addForm: any = {};
  list_type: string = 'all';
  deleteForm: any = {}; btnLoader: boolean;

  constructor(private api: OrderService, public commonService: CommonService) { }

  ngOnInit() {
    this.filterForm = { from_date: new Date(), to_date: new Date(new Date().setMonth(new Date().getMonth() + 1)) };
    this.getList();
  }

  getList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      this.api.APPOINTMENT_LIST(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(element => {
            element.customer_name = element.customerDetails[0].name;
            element.customer_email = element.customerDetails[0].email;
          });
        }
        else console.log("response", result);
      });
    }
  }

}