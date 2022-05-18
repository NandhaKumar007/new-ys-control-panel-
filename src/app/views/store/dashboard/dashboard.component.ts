import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Share } from '@capacitor/share';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { echartStyles } from '../../../shared/animations/echart-styles';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  preLoader: boolean; customerLoader: boolean;
  order_details: any; customer_details: any;
	chartPie: any; chartLine: any; filterForm: any;
  completedPercentage: any; baseUrl: string;
  dispDashboard: boolean; infoConfig: any;
  deployList: any = [
    {
      keyword: "account",
      heading: "Create your account", sub_heading: "",
      description: "",
      duration: "1", completed: true, redirect: "/account/profile"
    },
    {
      keyword: "logo", heading: "Add your logo",
      sub_heading: "",
      description: "",
      duration: "1", completed: false, redirect: "/store-setting/logo-management"
    },
    {
      keyword: "products", heading: "List your products",
      sub_heading: "Products → All Products",
      description: "Choose a template and add layouts to your website",
      duration: "1", completed: false, redirect: "/products"
    },
    {
      keyword: "shipping", heading: "Setup shipping methods",
      sub_heading: "Settings → Shipping Methods",
      description: "Select shipping options available to customers at checkout",
      duration: "1", completed: false, redirect: "/shipping/shipping-methods"
    },
    {
      keyword: "payments", heading: "Configure payment collection",
      sub_heading: "Settings → Payment Gateway",
      description: "Choose how people pay at checkout, including credit and debit cards, UPI, cash and more",
      duration: "1", completed: false, redirect: "/setup/payment-gateway"
    },
    {
      keyword: "package", heading: "Choose plan",
      sub_heading: "",
      description: "Choose the right plan for your business",
      duration: "1", completed: false, redirect: "/deployment/plans"
    }
  ];
  moreDeployList: any = [
    {
      keyword: "home_layouts", heading: "Design your website",
      sub_heading: "Website → Website Design",
      description: "Choose a template and add layouts to your website",
      duration: "5", completed: false, redirect: "/layouts/home"
    },
    {
      keyword: "domain", heading: "Setup your domain",
      sub_heading: "",
      description: "Choose your domain or add your domain for your website",
      duration: "5", completed: false, redirect: "/deployment/domain"
    },
    {
      keyword: "tax_rates", heading: "Add your taxation",
      sub_heading: "Settings → Tax Rates",
      description: "Create percentage tax rates based on state laws",
      duration: "1", completed: false, redirect: "/product-extras/tax-rates"
    },
    {
      keyword: "social_media", heading: "Social Media",
      sub_heading: "Website → Footer Configuration",
      description: "",
      duration: "1", completed: false, redirect: "/setup/footer-content"
    },
    {
      keyword: "store_seo", heading: "Store SEO",
      sub_heading: "Website → SEO → Store",
      description: "Change the appearance of your website in a search engine listing",
      duration: "1", completed: false, redirect: "/seo/store"
    },
    {
      keyword: "discount", heading: "Discounts",
      sub_heading: "Marketing Tools → Offers",
      description: "",
      duration: "1", completed: false, redirect: "/features/coupon-codes"
    },
    {
      keyword: "policy_builder", heading: "Policies",
      sub_heading: "",
      description: "",
      duration: "1", completed: false, redirect: "/setup/policies/privacy"
    }
  ];
  whats_new_list: any = {
    1: {
      date: "28 Aug 2021",
      steps: [
        {
          title: "Quick Checkout",
          description: "Share a link with pre-filled products to your customers on WhatsApp, Instagram and other channels."
        },
        {
          title: "Our New Identity",
          description: "A refreshing new logo and pleasing colour scheme."
        },
        {
          title: "SMS Validation for CoD",
          description: "Avoid fake orders through OTP-style validation for CoD orders."
        },
        {
          title: "Sound Notifications",
          description: "Get notified when new orders are placed."
        },
        {
          title: "yourstore PWA",
          description: "Access yourstore quickly by adding it to your home screen."
        }
      ]
    },
    2: {
      date: "16 Aug 2020",
      steps: [
        {
          title: "Colour Consistency",
          description: "Platform-wide vivid colour usage to bring in more consistency and hierarchy of buttons and elements for easy of use."
        },
        {
          title: "Language Consistency",
          description: "UI updated with clearer text and terminology for more coherent usage of the Platform."
        },
        {
          title: "More Control over yourstore",
          description: "Manage your Store Plugins and control Store Checkout settings in just a few clicks. Find this under 'Settings' in the Plugin Management tab."
        },
        {
          title: "Update Critical Information",
          description: "Pixel code, Google Analytics code, Store email and much more can now be updated in the '<span class='info-highlight'>Store Settings</span>' tab under '<span class='info-highlight'>Settings</span>'."
        },
        {
          title: "More Free Features coming your way",
          description: "Send WhatsApp messages, email or call abandoned cart customers directly, manage announcement bar content by yourself and we've thrown in a sale countdown timer for the announcement bar to usher in the urgency to complete a purchase from your customers."
        }
      ]
    },
    3: {
      date: "16 Aug 2019",
      steps: [
        {
          title: "Mobile Responsive and Optimised Backend",
          description: "Use all the features of the yourstore backend on your mobile. Manage orders, products, SEO & more on the fly."
        },
        {
          title: "Optimised UI",
          description: "UI Elements Design have been optimized for ease of use and understanding with clear definitions for each section."
        },
        {
          title: "Dark mode",
          description: "yourstore has just joined the dark mode party. Enjoy using yourstore even at night without straining your eyes with our enhanced dark UI."
        },
        {
          title: "Dashboard",
          description: "The new updated dashboard has all the right features for you to run and analyze your business in real-time."
        }
      ]
    }
  };
  whatsNewStep: number = 1;
  totalWhatsNewScreen: number = Object.keys(this.whats_new_list).length;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ApiService,
    private storeApi: StoreApiService, private datepipe: DatePipe, public commonService: CommonService
    ) {
    config.backdrop = 'static'; config.keyboard = false;
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
      });
    }
    this.baseUrl = this.commonService.store_details.base_url.replace("https://", "");
  }

  ngOnInit() {
    this.commonService.loadChat();
    this.commonService.pageTop(0);
    if(this.commonService.store_details.login_type=='admin' || this.commonService.subuser_features.indexOf('dashboard')!=-1) {
      // deploy stages
      this.commonService.setDeployStatus();
      this.updateDeployInfo();
      // dashboard
      this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
      this.dispDashboard = true;
      this.getDashboardData();
    }
	}

  updateDeployInfo() {
    let completedCount = 0;
    this.deployList.forEach(element => {
      if(element.keyword=='logo') {
        if(this.commonService.deploy_stages.logo && this.commonService.deploy_details?.theme_colors?.primary) {
          element.completed = true;
          completedCount++;
        }
      }
      else {
        if(this.commonService.deploy_stages[element.keyword] || element.completed) {
          element.completed = true;
          completedCount++;
        }
      }
    });
    this.completedPercentage = ((completedCount*100)/this.deployList.length).toFixed(1);
  }

  getDashboardData() {
    if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
      this.preLoader = true;
      this.order_details = {
        products: 0, order_list: [], gc_list: [], total_sales: 0, placed_orders: 0, confirmed_orders: 0,
        dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0, pending_orders: 0, gc_total_sales: 0
      };
      // DASHBOARD
      let formData: any = { from_date: this.filterForm.from_date, to_date: this.filterForm.to_date };
      if(localStorage.getItem("master_token")) formData.master_login = true;
      this.storeApi.DASHBOARD(formData).subscribe(result => {
        setTimeout(() => { this.preLoader = false; }, 500);
        if(result.status) {
          this.order_details.products = result.data.products;
          this.order_details.order_list = result.data.order_list.filter(obj => obj.order_status!='cancelled');
          this.order_details.cancelled_orders = result.data.order_list.length - this.order_details.order_list.length;
          this.order_details.order_list.forEach(element => {
            this.order_details.total_sales += element.final_price;
            if(element.order_status=='placed') this.order_details.placed_orders++;
            if(element.order_status=='confirmed') this.order_details.confirmed_orders++;
            if(element.order_status=='dispatched') this.order_details.dispatched_orders++;
            if(element.order_status=='delivered') this.order_details.completed_orders++;
          });
          this.order_details.gc_list = result.data.gc_list;
          this.order_details.gc_total_sales = this.order_details.gc_list.reduce((accumulator, currentValue) => {
            return accumulator + currentValue['price'];
          }, 0);
          this.chartPie = {
            ...echartStyles.defaultOptions, ...{
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                show: true,
                textStyle: { color:'#d83967' },
              },
              series: [{
                type: 'pie',
                ...echartStyles.pieRing,
                avoidLabelOverlap: false,
                width:'50%',
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                  }
                },
                labelLine: {
                  normal: { show: false }
                },
                data: [
                  { name: 'Awaiting', value: this.order_details.placed_orders, itemStyle: { color: '#FFC107' } },
                  { name: 'Confirmed', value: this.order_details.confirmed_orders, itemStyle: { color: '#42bcf5' } },
                  { name: 'Transit', value: this.order_details.dispatched_orders, itemStyle: { color: '#4CAF50' } },
                  { name: 'Pending', value: this.order_details.pending_orders, itemStyle: { color: '#f56725' } },
                  { name: 'Completed', value: this.order_details.completed_orders, itemStyle: { color: '#d83967' } },
                  { name: 'Cancelled', value: this.order_details.cancelled_orders, itemStyle: { color: '#a9a9a9' } }
                ]
              }]
            }
          };
          // line chart
          this.buildLineChart(this.order_details.order_list).then((respData) => {
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
          })
        }
        else console.log("dashboard response", result);
      });
      // CUSTOMERS
      this.customerLoader = true;
      this.customer_details = { total_customers: 0, abandoned_count: 0, top_customers: [] };
      this.storeApi.DASHBOARD_CUSTOMERS({ from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, limit: 4 }).subscribe(result => {
        setTimeout(() => { this.customerLoader = false; }, 500);
        if(result.status) {
          this.customer_details.total_customers = result.data.total_customers;
          this.customer_details.abandoned_count = result.data.abandoned_count;
          this.buildCustomerList(result.data.top_customers).then((respData) => {
            this.customer_details.top_customers = respData;
          });
        }
        else console.log("customer response", result);
      });
    }
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

  shareDomain(modalName, socialShareStatus) {
    if(this.commonService.deploy_stages.logo && this.commonService.deploy_details.theme_colors?.primary) {
      if(socialShareStatus) this.socialShare();
      else window.open(this.commonService.store_details.base_url, '_blank');
    }
    else {
      this.infoConfig = {
        content: "Please upload logo and theme colour in step 2 to view the website",
        btn_txt: "Upload Logo"
      };
      if(this.commonService.deploy_stages.logo) {
        this.infoConfig = {
          content: "Please set theme colour in step 2 to view the website",
          btn_txt: "Set Colour"
        };
      }
      this.modalService.open(modalName, { size: 'md', centered: true});
    }
  }

  socialShare() {
    if(environment.keep_login) {
      Share.share({
        title: '', text: '', dialogTitle: '',
        url: this.commonService.store_details.base_url
      });
    }
    else {
      let windowNav: any = window.navigator;
      if(windowNav && windowNav.share) {
        windowNav.share({
          title: '', text: '',
          url: this.commonService.store_details.base_url
        })
        .catch( (error) => { console.log(error); });
      }
      else console.log("share not supported")
    }
  }

  ngOnDestroy() {
    this.commonService.hideChat();
  }

}