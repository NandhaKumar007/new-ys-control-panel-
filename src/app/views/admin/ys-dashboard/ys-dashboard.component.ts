import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { echartStyles } from '../../../shared/animations/echart-styles';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-dashboard',
  templateUrl: './ys-dashboard.component.html',
  styleUrls: ['./ys-dashboard.component.scss']
})
export class YsDashboardComponent implements OnInit {

  card_details: any = {};
  preLoader: boolean; filterForm: any;
  page = 1; orderPage = 1; revenuePage = 1;
  chartLine: any; dashboardCategory: string = 'genie';

  constructor(private datepipe: DatePipe, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
    this.card_details = {};
    this.getDashboardData();
  }

  getDashboardData() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      let fromDate = new Date(this.filterForm.from_date).setHours(0,0,0,0);
      let toDate = new Date(this.filterForm.to_date).setHours(23,59,59,999);
      if(new Date(toDate) >= new Date(fromDate))
      {
        this.preLoader = true;
        // DASHBOARD
        this.adminApi.DASHBOARD({ category: this.dashboardCategory, from_date: fromDate, to_date: toDate }).subscribe(result => {
          setTimeout(() => { this.preLoader = false; }, 500);
          if(result.status) {
            this.card_details = result;
            this.card_details.signup_list.forEach(obj => {
              if(obj.deployDetails?.category) obj.temp_category = obj.deployDetails.category;
            });
            this.card_details.plan_selected = this.card_details.activated_list.filter(obj => obj.package_details.billing_status).length;
            this.card_details.package_list = this.commonService.admin_packages.filter(el => el.category==this.dashboardCategory);
            // line chart
            this.buildLineChart(this.card_details.signup_list).then((respData) => {
              this.chartLine = {
                ...echartStyles.lineNoAxis, ...{
                  series: [{
                    data: respData.orders,
                    lineStyle: {
                      color: 'rgba(216, 57, 103, .86)',
                      width: 3,
                      shadowColor: 'rgba(0, 0, 0, .2)',
                      shadowOffsetX: -1,
                      shadowOffsetY: 8,
                      shadowBlur: 10
                    },
                    label: { show: true, color: '#212121' },
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                      borderColor: 'rgba(216, 57, 103, 0.86)'
                    }
                  }]
                }
              };
              this.chartLine.xAxis.data = respData.days;
            });
            // category list
            this.commonService.store_categories.forEach(obj => {
              obj.count = this.card_details.signup_list.filter(el => el.temp_category==obj.name).length;
            });
            this.commonService.store_categories.sort((a, b) => 0 - (a.count > b.count ? 1 : -1));
            // packages
            this.card_details.package_list.forEach(obj => {
              obj.count = this.card_details.activated_list.filter(el => el.package_details.billing_status && el.package_details?.package_id==obj._id).length;
            });
            // revenue
            this.card_details.revenue = 0;
            this.card_details.revenue_list.forEach(obj => {
              this.card_details.revenue += obj.amount;
            });
            // store orders
            this.card_details.store_orders = [];
            this.card_details.store_revenues = [];
            this.card_details.activated_list.forEach(el => {
              el.currency = el.currency_types.filter(obj => obj.default_currency)[0];
              let storeOrders = this.card_details.order_list.filter(obj => obj.store_id==el._id);
              el.orders = storeOrders.length;
              el.revenue = 0;
              if(el.orders>0) {
                el.revenue = storeOrders.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue['final_price'];
                }, 0);
                this.card_details.store_orders.push(el);
                this.card_details.store_revenues.push(el);
              }
            });
          }
          else console.log("dashboard response", result);
        });
      }
    }
  }

  async buildLineChart(storeList) {
    let date1: any = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
    let date2: any = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,59));
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let dayList = []; let ordersCountList = [];
    if(diffDays > 1) {
      for(let i=1; i<=diffDays; i++)
      {
        let currDate = new Date(this.filterForm.to_date).setDate(new Date(this.filterForm.to_date).getDate() - (diffDays-i));
        let orderCount = await this.processStoreList(storeList, new Date(currDate).setHours(0,0,0,0), new Date(currDate).setHours(23,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(currDate), 'dd MMM y'));
          ordersCountList.push(orderCount);
        }
      }
    }
    else {
      for(let i=0; i<=23; i++)
      {
        let orderCount = await this.processStoreList(storeList, new Date(this.filterForm.from_date).setHours(i,0,0,0), new Date(this.filterForm.from_date).setHours(i,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(new Date(this.filterForm.from_date).setHours(i,0,0,0)), 'hh:mm a'));
          ordersCountList.push(orderCount);
        }
      }
    }
    return ({days: dayList, orders: ordersCountList});
  }

  processStoreList(storeList, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      let count = storeList.filter(obj => new Date(obj.created_on) >= new Date(fromDate) && new Date(toDate) > new Date(obj.created_on)).length;
      resolve(count);
    });
  }

  onFilterChange(x) {
    let startDate = new Date(new Date().setHours(0,0,0,0));
    let endDate = new Date(new Date().setHours(23,59,59,999));
    if(x=='today') { this.filterForm.from_date = startDate; this.filterForm.to_date = endDate; }
    else if(x=='yesterday') { this.filterForm.from_date = new Date(startDate.setDate(startDate.getDate() - 1)); this.filterForm.to_date = new Date(endDate.setDate(endDate.getDate() - 1)); }
    else if(x=='last_7_days') {
      this.filterForm.from_date = new Date(startDate.setDate(startDate.getDate() - 7)); this.filterForm.to_date = endDate;
    }
    else if(x=='last_30_days') { this.filterForm.from_date = new Date(startDate.setDate(startDate.getDate() - 30)); this.filterForm.to_date = endDate; }
    else if(x=='current_month') { this.filterForm.from_date = new Date(startDate.getFullYear(), startDate.getMonth(), 1); this.filterForm.to_date = endDate; }
    else if(x=='last_month') {
      let prevMonth = new Date().setMonth(new Date().getMonth() - 1);
      this.filterForm.from_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth(), 1);
      this.filterForm.to_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth() + 1, 0);
    }
    else if(x=='current_year') { this.filterForm.from_date = new Date(new Date().getFullYear(), 0, 1); this.filterForm.to_date = endDate; }
    else if(x=='last_year') {
      let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
      this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 0, 1);
      this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 11, 31);
    }
    else if(x=='current_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = endDate;
      }
      else {
        // new fin year started (on apr to dec)
        let nextYear = new Date().setFullYear(new Date().getFullYear() + 1);
        this.filterForm.from_date = new Date(new Date().getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(nextYear).getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = endDate;
      }
    }
    else if(x=='last_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let pastPrevYear = new Date().setFullYear(new Date().getFullYear() - 2);
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(pastPrevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 2, 31);
      }
      else {
        // new fin year started (on apr to dec)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
      }
    }
		this.getDashboardData();
  }

}