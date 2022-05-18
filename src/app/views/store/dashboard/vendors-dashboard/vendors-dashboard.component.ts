import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-vendors-dashboard',
  templateUrl: './vendors-dashboard.component.html',
  styleUrls: ['./vendors-dashboard.component.scss']
})

export class VendorsDashboardComponent implements OnInit {

  preLoader: boolean; order_details: any = {
    total_sales: 0, order_list: [], vendor_items: [], item_grand_total: 0,
    vendor_products: 0, products: 0
  };
	chartPie: any; chartLine: any; filterForm: any;

  constructor(public datepipe: DatePipe, public commonService: CommonService) { }

  ngOnInit() {
    this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
    this.getDashboardData();
	}

  getDashboardData() {
    // if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
    //   this.preLoader = true;
    //   this.order_details = {
    //     products: 0, vendor_products: 0, order_list: [], total_sales: 0, placed_orders: 0, confirmed_orders: 0,
    //     dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0, pending_orders: 0, vendor_items: [], item_grand_total: 0
    //   };
    //   // DASHBOARD
    //   this.api.VENDOR_DASHBOARD({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, vendor_id: this.commonService.vendor_details?._id }).subscribe(result => {
    //     setTimeout(() => { this.preLoader = false; }, 500);
    //     if(result.status) {
    //       this.order_details.products = result.data.products;
    //       this.order_details.vendor_products = result.data.vendor_products;
    //       this.order_details.order_list = result.data.order_list.filter(obj => obj.order_status!='cancelled');
    //       this.order_details.cancelled_orders = result.data.order_list.length - this.order_details.order_list.length;
    //       this.order_details.order_list.forEach(element => {
    //         let vendorOrderPrice = 0
    //         element.item_list.filter(item => item.vendor_id==this.commonService.vendor_details?._id).forEach(obj => {
    //           vendorOrderPrice += (obj.final_price*obj.quantity)+parseFloat(obj.addon_price);
    //           if(element.unit=="Pcs") vendorOrderPrice += obj.final_price*obj.quantity;
    //           if(this.order_details.vendor_items.indexOf(obj._id) == -1) {
    //             this.order_details.vendor_items.push(obj._id);
    //             this.order_details.item_grand_total += obj.discounted_price;
    //           }
    //         });
    //         this.order_details.total_sales += vendorOrderPrice;
    //         let vendorIndex = element.vendor_list.findIndex(obj => obj.vendor_id==this.commonService.vendor_details?._id);
    //         if(element.order_status=='delivered') this.order_details.completed_orders++;
    //         else {
    //           if(element.vendor_list[vendorIndex].status=='pending') this.order_details.placed_orders++;
    //           if(element.vendor_list[vendorIndex].status=='confirmed') this.order_details.confirmed_orders++;
    //         }
    //       });
    //       // pie chart
    //       // this.chartPie = {
    //       //   ...echartStyles.defaultOptions, ...{
    //       //     legend: {
    //       //       show: true,
    //       //       bottom: 0,
    //       //     },
    //       //     series: [{
    //       //       type: 'pie',
    //       //       ...echartStyles.pieRing,
    //       //       label: echartStyles.pieLabelCenterHover,
    //       //       data: [
    //       //         { name: 'Awaiting', value: this.order_details.placed_orders, itemStyle: { color: '#FFC107' } },
    //       //         { name: 'Confirmed', value: this.order_details.confirmed_orders, itemStyle: { color: '#42bcf5' } },
    //       //         { name: 'Transit', value: this.order_details.dispatched_orders, itemStyle: { color: '#4CAF50' } },
    //       //         { name: 'Pending', value: this.order_details.pending_orders, itemStyle: { color: '#f56725' } },
    //       //         { name: 'Completed', value: this.order_details.completed_orders, itemStyle: { color: '#d83967' } },
    //       //         { name: 'Cancelled', value: this.order_details.cancelled_orders, itemStyle: { color: '#a9a9a9' } }
    //       //       ]
    //       //     }]
    //       //   }
    //       // };
    //       this.chartPie = {
    //         ...echartStyles.defaultOptions, ...{

    //           tooltip: {
    //             trigger: 'item',
    //             formatter: '{a} <br/>{b}: {c} ({d}%)'
    //         },

    //           legend: {
    //             show: true,
    //             textStyle: {
    //               color:'#d83967'
    //           },

    //           },
    //           series: [{
    //             type: 'pie',
    //             ...echartStyles.pieRing,
    //             avoidLabelOverlap: false,
    //             width:'50%',
    //             label: {
    //               normal: {
    //                   show: false,
    //                   position: 'center'
    //               },
    //               emphasis: {
    //                   show: true,
    //               }
    //           },
    //           labelLine: {
    //               normal: {
    //                   show: false
    //               }
    //           },
    //             data: [
    //               { name: 'Awaiting', value: this.order_details.placed_orders, itemStyle: { color: '#FFC107' } },
    //               { name: 'Confirmed', value: this.order_details.confirmed_orders, itemStyle: { color: '#42bcf5' } },
    //               { name: 'Completed', value: this.order_details.completed_orders, itemStyle: { color: '#d83967' } },
    //               { name: 'Cancelled', value: this.order_details.cancelled_orders, itemStyle: { color: '#a9a9a9' } }
    //             ]
    //           }]
    //         }
    //       };
    //       // line chart
    //       this.buildLineChart(this.order_details.order_list).then((respData) => {
    //         this.chartLine = {
    //           ...echartStyles.lineNoAxis, ...{
    //             series: [{
    //               data: respData.orders,
    //               lineStyle: {
    //                 color: 'rgba(216, 57, 103, .86)',
    //                 width: 3,
    //                 shadowColor: 'rgba(0, 0, 0, .2)',
    //                 shadowOffsetX: -1,
    //                 shadowOffsetY: 8,
    //                 shadowBlur: 10
    //               },
    //               label: { show: true, color: '#212121' },
    //               type: 'line',
    //               smooth: true,
    //               itemStyle: {
    //                 borderColor: 'rgba(216, 57, 103, 0.86)'
    //               }
    //             }]
    //           }
    //         };
    //         this.chartLine.xAxis.data = respData.days;
    //       })
    //     }
    //     else console.log("dashboard response", result);
    //   });
    // }
  }

  onFilterChange(x) {
    if(x=='today') { this.filterForm.from_date = new Date; this.filterForm.to_date = new Date; }
    else if(x=='yesterday') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 1)); this.filterForm.to_date = new Date(new Date().setDate(new Date().getDate() - 1)); }
    else if(x=='last_7_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 7)); this.filterForm.to_date = new Date; }
    else if(x=='last_30_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 30)); this.filterForm.to_date = new Date; }
    else if(x=='current_month') { this.filterForm.from_date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); this.filterForm.to_date = new Date; }
    else if(x=='last_month') {
      let prevMonth = new Date().setMonth(new Date().getMonth() - 1);
      this.filterForm.from_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth(), 1);
      this.filterForm.to_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth() + 1, 0);
    }
    else if(x=='current_year') { this.filterForm.from_date = new Date(new Date().getFullYear(), 0, 1); this.filterForm.to_date = new Date; }
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
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
      }
      else {
        // new fin year started (on apr to dec)
        let nextYear = new Date().setFullYear(new Date().getFullYear() + 1);
        this.filterForm.from_date = new Date(new Date().getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(nextYear).getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
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
    else if(x=='all_time') { this.filterForm.from_date = new Date(this.commonService.store_details.created_on); this.filterForm.to_date = new Date; }
		this.getDashboardData();
  }
  
  async buildLineChart(orderList) {
    let diff = Math.abs(new Date(this.filterForm.from_date).getTime() - this.filterForm.to_date.getTime());
    let diffDays = Math.ceil(diff / (1000*3600*24));
    let dayList = []; let ordersCountList = [];
    if(diffDays > 0) {
      for(let i=1; i<=diffDays; i++)
      {
        let currDate = new Date(this.filterForm.to_date).setDate(new Date(this.filterForm.to_date).getDate() - (diffDays-i));
        let orderCount = await this.processOrderList(orderList, new Date(currDate).setHours(0,0,0,0), new Date(currDate).setHours(23,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(currDate), 'dd MMM y'));
          ordersCountList.push(orderCount);
        }
      }
    }
    else {
      for(let i=0; i<=23; i++)
      {
        let currDate = "";
        let orderCount = await this.processOrderList(orderList, new Date(this.filterForm.from_date).setHours(i,0,0,0), new Date(this.filterForm.from_date).setHours(i,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(new Date(this.filterForm.from_date).setHours(i,0,0,0)), 'hh:mm a'));
          ordersCountList.push(orderCount);
        }
      }
    }
    return ({days: dayList, orders: ordersCountList});
  }

  processOrderList(orderList, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      let count = orderList.filter(obj => new Date(obj.created_on) >= new Date(fromDate) && new Date(toDate) > new Date(obj.created_on)).length;
      resolve(count);
    });
  }
  
  async buildCustomerList(customerList) {
    let updatedCustomers = [];
    for(let i=0; i<customerList.length; i++)
    {
      let orderDetails: any = await this.processCustomerOrders(customerList[i].order_list);
      if(orderDetails.total_price > 0) {
        orderDetails._id = customerList[i].customerDetails[0]._id;
        orderDetails.name = customerList[i].customerDetails[0].name;
        orderDetails.email = customerList[i].customerDetails[0].email;
        updatedCustomers.push(orderDetails);
      }
    }
    return updatedCustomers;
  }

  processCustomerOrders(orderList) {
    return new Promise((resolve, reject) => {
      let orderDetails = { total_qty: 0, total_price: 0 };
      for(let i=0; i<orderList.length; i++)
      {
        orderDetails.total_price += orderList[i].final_price;
        orderDetails.total_qty += orderList[i].item_list.reduce((accumulator, currentValue) => {
          return accumulator + currentValue['quantity'];
        }, 0);
      }
      resolve(orderDetails);
    });
  }

}