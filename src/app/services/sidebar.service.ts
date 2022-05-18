import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreApiService } from '../services/store-api.service';
import { CommonService } from '../services/common.service';
import { environment } from 'src/environments/environment';

export interface IMenuItem {
	id?: string;
	title?: string;
	type: string;       // Possible values: link/dropDown/extLink
	name?: string;      // Used as display text for item and title for separator type
	state?: string;     // Router state
	icon?: string;      // Material icon name
	tooltip?: string;   // Tooltip text
	disabled?: boolean; // If true, item will not be appeared in sidenav.
	sub?: IChildItem[]; // Dropdown items
	badges?: IBadge[];
	active?: boolean;
}

export interface IChildItem {
	id?: string;
	parentId?: string;
	type?: string;
	name: string;       // Display text
	state?: string;     // Router state
	icon?: string;
	sub?: IChildItem[];
	active?: boolean;
}

interface IBadge {
	color: string;      // primary/accent/warn/hex color codes(#fff000)
	value: string;      // Display text
}

interface ISidebarState {
	sidenavOpen?: boolean;
	childnavOpen?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class SidebarService {

	public sidebarState: ISidebarState = {
		sidenavOpen: true,
		childnavOpen: false
  };
  sidePanelList: IMenuItem[] = [];

	constructor(private storeApi: StoreApiService, private commonService: CommonService, private router: Router) { }

	BUILD_CATEGORY_LIST() {
    this.storeApi.CATALOG_LIST().subscribe(result => {
      this.commonService.catalog_list = [];
      if(result.status) { this.commonService.catalog_list = result.list; }
      this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
    });
  }
  
  getSidePanelList() {
    this.sidePanelList = [];
    let routePermissionList = [];
    // whats new
    let ysFeatures = this.commonService.ys_features;
    let subuserFeatures = this.commonService.subuser_features;
    // admin
    if(this.commonService.store_details.login_type=='admin') {
      if(this.commonService.store_details.status=='active') {
        routePermissionList.push("dashboard", "customers", "profile");
        if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
        // dashboard
        this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
        // product extras
        let prodExtraList: IChildItem[] = [];
        if(ysFeatures.indexOf('measurements')!=-1) {
          prodExtraList.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' });
          routePermissionList.push("measurements");
        }
        if(ysFeatures.indexOf('addons')!=-1) {
          prodExtraList.push({ name: 'Addons', state: '/product-extras/addons', type: 'link' });
          routePermissionList.push("addons");
        }
        if(ysFeatures.indexOf('product_filters')!=-1) {
          prodExtraList.push({ name: 'Tags', state: '/product-extras/tags', type: 'link' });
          routePermissionList.push("tags");
        }
        if(ysFeatures.indexOf('foot_note')!=-1) {
          prodExtraList.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link' });
          routePermissionList.push("foot_note");
        }
        if(ysFeatures.indexOf('size_chart')!=-1) {
          prodExtraList.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' });
          routePermissionList.push("size_chart");
        }
        if(ysFeatures.indexOf('faq')!=-1) {
          prodExtraList.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link' });
          routePermissionList.push("faq");
        }
        if(this.commonService.store_details?.package_info?.category!='genie') {
          prodExtraList.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link' });
          routePermissionList.push("product_taxonomy");
        }
        if(ysFeatures.indexOf('variant_colors')!=-1) {
          prodExtraList.push({ name: 'Variant Colors', state: '/product-extras/variant-colors', type: 'link' });
          routePermissionList.push("variant_colors");
        }
        if(ysFeatures.indexOf('amenities')!=-1) {
          prodExtraList.push({ name: 'Amenities', state: '/product-extras/amenities', type: 'link' });
          routePermissionList.push("amenities");
        }
        // products
        routePermissionList.push("catalogs", "products", "product_add", "product_edit");
        let prodList: IChildItem[] = [
          { icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' },
          { icon: 'category', name: 'All Products', state: '/products', type: 'link' }
        ];
        if(prodExtraList.length) prodList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: prodExtraList });
        if(ysFeatures.indexOf('product_archive')!=-1) {
          prodList.push({ icon: 'archive', name: 'Archived Products', state: '/product-extras/archive', type: 'link' });
          routePermissionList.push("product_archive");
        }
        if(this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id || ysFeatures.indexOf('product_reviews')!=-1) {
          prodList.push({ icon: 'rate_review', name: 'Product Reviews', state: '/features/product-reviews', type: 'link' });
          routePermissionList.push("product_reviews");
        }
        this.sidePanelList.push({ name: 'Products', type: 'dropDown', icon: 'category', sub: prodList });
        // quotations
        if(this.commonService.store_details.type == 'quot_based' || this.commonService.store_details.type == 'quot_with_order_based') {
          let quotList: IChildItem[] = [
            { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
            { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
            { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' }
          ];
          // abandoned
          if(ysFeatures.indexOf('abandoned_cart')!=-1) {
            quotList.push({ name: 'Abandoned Quote', type: 'dropDown', icon: 'remove_shopping_cart', sub: [
              { name: 'Signed Up Users', state: '/abandoned-quote/customer', type: 'link' },
              { name: 'Guest Users', state: '/abandoned-quote/guest-user', type: 'link' }
            ] });
            routePermissionList.push("abandoned_quotes");
          }
          // customer
          quotList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', sub: [
            { name: 'Signed Up Users', state: '/customers', type: 'link' },
            { name: 'Guest Users', state: '/guest-users', type: 'link' }
          ] });
          this.sidePanelList.push({ name: 'Quotations', type: 'dropDown', icon: 'description', sub: quotList });
          routePermissionList.push("quotations");
        }
        // orders
        if(this.commonService.store_details.type != 'quot_based') {
          // product
          let orderList: IChildItem[] = [
            { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
            { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
            { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
          ];
          let inactiveOrders: IChildItem[] = [{ name: 'Product', state: '/orders/inactive-orders', type: 'link' }];
          // gift card
          if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
            orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
            // inactiveOrders.push({ name: 'Gift Card', state: '/orders/inactive-gift-coupons', type: 'link' })
            routePermissionList.push("inactive_gift_orders");
          }
          // quick order
          if(this.commonService.store_details.type!='quot_with_order_based' && ysFeatures.indexOf('quick_order')!=-1) {
            orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/features/quick-orders', type: 'link' });
            routePermissionList.push("quick_order");
          }
          // dinamic offers
          if(ysFeatures.indexOf('dinamic_offers')!=-1) {
            orderList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/orders/dinamic-offers', type: 'link' });
            inactiveOrders.push({ name: 'DiNAMIC', state: '/orders/inactive-dinamic-offers', type: 'link' })
            routePermissionList.push("inactive_dinamic_offer_orders");
          }
          // appointments
          if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
            orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
            routePermissionList.push("appointments");
          }
          if(this.commonService.store_details.type!='quot_with_order_based') {
            // inactive orders
            if(inactiveOrders.length>1) orderList.push({ name: 'Failed Payments', type: 'dropDown', icon: 'error_outline', sub:inactiveOrders });
            else orderList.push({ icon: 'error_outline', name: 'Failed Payments', state: '/orders/inactive-orders', type: 'link' });
            // vendor settlement
            if(this.commonService.master_token && ysFeatures.indexOf('vendors')!=-1) {
              orderList.push({ icon: 'paid', name: 'Settlement Orders', state: '/orders/settlement', type: 'link' });
              routePermissionList.push("vendor_settlement");
            }
            // abandoned
            if(ysFeatures.indexOf('abandoned_cart')!=-1) {
              orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', sub: [
                { name: 'Signed Up Users', state: '/abandoned-cart/customer', type: 'link' },
                { name: 'Guest Users', state: '/abandoned-cart/guest-user', type: 'link' }
              ] });
              routePermissionList.push("abandoned_cart");
            }
            // customer
            orderList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', sub: [
              { name: 'Signed Up Users', state: '/customers', type: 'link' },
              { name: 'Guest Users', state: '/guest-users', type: 'link' }
            ] });
          }
          this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
          routePermissionList.push("orders", "inactive_orders");
          if(ysFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
        }
        // marketing tools
        let toolList: IChildItem[] = [];
        if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
          toolList.push({ icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' });
          routePermissionList.push("offers");
        }
        if(ysFeatures.indexOf('giftcard')!=-1) {
          toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' });
          routePermissionList.push("giftcard", "giftcard_orders");
        }
        if(ysFeatures.indexOf('newsletter')!=-1) {
          toolList.push({ icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' });
          routePermissionList.push("newsletter");
        }
        if(ysFeatures.indexOf('customer_feedback')!=-1) {
          toolList.push({ icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' });
          routePermissionList.push("feedback");
        }
        if(toolList.length) this.sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'build_circle', sub: toolList });
        // website
        let seoList: IChildItem[] = [];
        if(ysFeatures.indexOf('advanced_seo')!=-1) {
          routePermissionList.push("store_seo", "catalog_seo", "product_seo");
          seoList.push({ name: 'Store', state: '/seo/store', type: 'link' });
          seoList.push({ name: 'Catalog', state: '/seo/catalog', type: 'link' });
          seoList.push({ name: 'Product', state: '/seo/product', type: 'link' });
          if(ysFeatures.indexOf('blogs')!=-1) {
            seoList.push({ name: 'Blog', state: '/seo/blog', type: 'link' });
            routePermissionList.push("blog_seo");
          }
          if(ysFeatures.indexOf('extra_pages')!=-1) {
            seoList.push({ name: 'Extra Pages', state: '/seo/extra-pages', type: 'link' });
            routePermissionList.push("extra_page_seo");
          }
        }
        routePermissionList.push("home_layout", "policies", "contact_page", "footer_content");
        let wdList: IChildItem[] = [{ name: 'Home Page', state: '/layouts/home', type: 'link' }];
        if(this.commonService.store_details?.package_info?.category!='genie') {
          wdList.push(
            { name: 'Catalog Page', state: '/layouts/catalog', type: 'link' },
            // { name: 'Product Page', state: '/layouts/product', type: 'link' }
          );
          routePermissionList.push("catalog_layout", "product_layout");
        }
        let webList: IChildItem[] = [
          { name: 'Website Design', type: 'dropDown', icon: 'format_paint', sub: wdList }
        ];
        if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
          webList.push({ icon: 'menu_book', name: 'Menu', state: '/features/menus', type: 'link' });
          routePermissionList.push("menus");
        }
        webList.push({
          name: 'Policies', type: 'dropDown', icon: 'policy',
          sub: [
            { name: 'Privacy Policy', state: '/setup/policies/privacy', type: 'link' },
            { name: 'Shipping Policy', state: '/setup/policies/shipping', type: 'link' },
            { name: 'Cancellation Policy', state: '/setup/policies/cancellation', type: 'link' },
            { name: 'Terms & Conditions', state: '/setup/policies/terms_conditions', type: 'link' }
          ]
        });
        if(seoList.length) webList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoList });
        else if(ysFeatures.indexOf('basic_seo')!=-1) {
          webList.push({ name: 'SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
          routePermissionList.push("store_seo");
        }
        webList.push({ icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' });
        if(ysFeatures.indexOf('store_locator')!=-1) {
          webList.push({ icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' });
          routePermissionList.push("store_locator");
        }
        if(ysFeatures.indexOf('extra_pages')!=-1) {
          webList.push({ icon: 'note_add', name: 'Extra Pages', state: '/setup/extra-pages', type: 'link' });
          routePermissionList.push("extra_pages");
        }
        webList.push({ icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' });
        this.sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'language', sub: webList });
        // store modules
        let moduleList: IChildItem[] = [];
        if(ysFeatures.indexOf('shopping_assistant')!=-1) {
          moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' });
          routePermissionList.push("shopping_assistant");
        }
        if(ysFeatures.indexOf('sizing_assistant')!=-1) {
          moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' });
          routePermissionList.push("sizing_assistant");
        }
        if(ysFeatures.indexOf('currency_variation')!=-1) {
          moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' });
          routePermissionList.push("currency_types");
        }
        if(ysFeatures.indexOf('blogs')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' });
          routePermissionList.push("blogs");
        }
        if(ysFeatures.indexOf('discounts_page')!=-1) {
          moduleList.push({ icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' });
          routePermissionList.push("discounts_page");
        }
        if(ysFeatures.indexOf('collections')!=-1) {
          moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' });
          routePermissionList.push("collections");
        }
        if(ysFeatures.indexOf('dinamic_offers')!=-1) {
          moduleList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/features/dinamic-offers', type: 'link' });
          routePermissionList.push("dinamic_offers", "dinamic_offer_orders");
        }
        if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
          moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/features/appointment-categories', type: 'link' });
          routePermissionList.push("appointment_services");
        }
        if(moduleList.length) this.sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleList });
        // setting
        let settingList: IChildItem[] = [];
        if(ysFeatures.indexOf('tax_rates')!=-1) {
          settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' });
          routePermissionList.push("tax_rates");
        }
        if(ysFeatures.indexOf('time_based_delivery')!=-1) {
          settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' });
          routePermissionList.push("delivery_methods");
        }
        else {
          settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' });
          routePermissionList.push("shipping_methods");
        }
        if(ysFeatures.indexOf('pincode_service')!=-1) {
          settingList.push({ icon: 'fmd_good', name: 'Pincode Service', state: '/shipping/pincodes', type: 'link' });
          routePermissionList.push("pincodes");
        }
        routePermissionList.push("payment_gateway", "store_setting");
        settingList.push(
          { icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' },
          { icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' }
        );
        this.sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'settings', sub: settingList });
        // my account
        routePermissionList.push("deployment", "app_store", "billing", "branches");
        let accountList: IChildItem[] = [];
        accountList.push(
          { icon: 'account_circle', name: 'Profile', state: '/account/profile', type: 'link' },
          { icon: 'store', name: 'Branches', state: '/account/branches', type: 'link' }
        );
        if(ysFeatures.indexOf('1_staff')!=-1 || ysFeatures.indexOf('5_staff')!=-1 || ysFeatures.indexOf('10_staff')!=-1 || ysFeatures.indexOf('20_staff')!=-1) {
          accountList.push({ icon: 'supervised_user_circle', name: 'Users', state: '/account/users', type: 'link' });
          routePermissionList.push("sub_users");
        }
        if(ysFeatures.indexOf('vendors')!=-1) {
          accountList.push({ icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' });
          routePermissionList.push("vendors");
        }
        if(this.commonService.store_details.dp_wallet_status) {
          accountList.push({ icon: 'account_balance_wallet', name: 'Wallet', state: '/account/wallet', type: 'link' });
          routePermissionList.push("dp_wallet");
        }
        if(this.commonService.master_token) {
          accountList.push({ icon: 'widgets', name: 'App Store', state: '/account/app-store', type: 'link' });
        }
        accountList.push({ icon: 'receipt_long', name: 'Billing', state: '/account/billing', type: 'link' });
        this.sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
      }
      else {
        routePermissionList.push("deployment", "billing");
      }
    }
    // Sub User
    else if(this.commonService.store_details.login_type=='subuser') {
      if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
      this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/dashboard' });
      routePermissionList.push("dashboard");
      // product extras
      let prodExtraList: IChildItem[] = [];
      if(ysFeatures.indexOf('measurements')!=-1 && subuserFeatures.indexOf('measurements')!=-1) {
        prodExtraList.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link' });
        routePermissionList.push("measurements");
      }
      if(ysFeatures.indexOf('addons')!=-1 && subuserFeatures.indexOf('addons')!=-1) {
        prodExtraList.push({ name: 'Addons', state: '/product-extras/addons', type: 'link' });
        routePermissionList.push("addons");
      }
      if(ysFeatures.indexOf('product_filters')!=-1 && subuserFeatures.indexOf('product_filters')!=-1) {
        prodExtraList.push({ name: 'Tags', state: '/product-extras/tags', type: 'link' });
        routePermissionList.push("tags");
      }
      if(ysFeatures.indexOf('foot_note')!=-1 && subuserFeatures.indexOf('foot_note')!=-1) {
        prodExtraList.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link' });
        routePermissionList.push("foot_note");
      }
      if(ysFeatures.indexOf('size_chart')!=-1 && subuserFeatures.indexOf('size_chart')!=-1) {
        prodExtraList.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link' });
        routePermissionList.push("size_chart");
      }
      if(ysFeatures.indexOf('faq')!=-1 && subuserFeatures.indexOf('faq')!=-1) {
        prodExtraList.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link' });
        routePermissionList.push("faq");
      }
      if(this.commonService.store_details?.package_info?.category!='genie' && subuserFeatures.indexOf('product_taxonomy')!=-1) {
        prodExtraList.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link' });
        routePermissionList.push("product_taxonomy");
      }
      // products
      let prodList: IChildItem[] = [];
      if(subuserFeatures.indexOf('catalogs')!=-1) {
        prodList.push({ icon: 'view_carousel', name: 'Catalog Management', state: '/catalogs', type: 'link' });
        routePermissionList.push("catalogs");
      }
      if(subuserFeatures.indexOf('products')!=-1) {
        prodList.push({ icon: 'category', name: 'All Products', state: '/products', type: 'link' });
        routePermissionList.push("products", "product_add", "product_edit");
      }
      if(prodExtraList.length) prodList.push({ name: 'Product Extras', type: 'dropDown', icon: 'extension', sub: prodExtraList });
      if(ysFeatures.indexOf('product_archive')!=-1 && subuserFeatures.indexOf('product_archive')!=-1) {
        prodList.push({ icon: 'archive', name: 'Archived Products', state: '/product-extras/archive', type: 'link' });
        routePermissionList.push("product_archive");
      }
      if(ysFeatures.indexOf('product_reviews')!=-1 && subuserFeatures.indexOf('product_reviews')!=-1) {
        prodList.push({ icon: 'rate_review', name: 'Product Reviews', state: '/features/product-reviews', type: 'link' });
        routePermissionList.push("product_reviews");
      }
      if(prodList.length) this.sidePanelList.push({ name: 'Products', type: 'dropDown', icon: 'category', sub: prodList });
      // quotations
      // if(this.commonService.store_details.type == 'quot_based' || this.commonService.store_details.type == 'quot_with_order_based') {
      //   let quotList: IChildItem[] = [
      //     { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
      //     { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
      //     { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
      //     { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' }
      //   ];
      //   if(this.commonService.store_details.type == 'quot_based') quotList.push({ icon: 'supervisor_account', name: 'Customers', state: '/customers', type: 'link' });
      //   this.sidePanelList.push({ name: 'Quotations', type: 'dropDown', icon: 'description', sub: quotList });
      //   routePermissionList.push("quotations", "abandoned_quotes");
      // }
      // orders
      if(this.commonService.store_details.type != 'quot_based') {
        // product
        let orderList: IChildItem[] = [];
        if(subuserFeatures.indexOf('live_orders')!=-1)
          orderList.push({ icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' });
        if(subuserFeatures.indexOf('completed_orders')!=-1)
          orderList.push({ icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' });
        if(subuserFeatures.indexOf('cancelled_orders')!=-1)
          orderList.push({ icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' });
        if(orderList.length) routePermissionList.push("orders");
        let inactiveOrders: IChildItem[] = [];
        if(subuserFeatures.indexOf('inactive_orders')!=-1) {
          inactiveOrders.push({ name: 'Product', state: '/orders/inactive-orders', type: 'link' });
          routePermissionList.push("inactive_orders");
        }
        // gift card
        if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
          if(subuserFeatures.indexOf('giftcard_orders')!=-1) orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
          // if(subuserFeatures.indexOf('inactive_giftcard_orders')!=-1) {
          //   inactiveOrders.push({ name: 'Gift Card', state: '/orders/inactive-gift-coupons', type: 'link' })
          //   routePermissionList.push("inactive_gift_orders");
          // }
        }
        // quick order
        if(ysFeatures.indexOf('quick_order')!=-1 && subuserFeatures.indexOf('quick_order')!=-1) {
          orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/features/quick-orders', type: 'link' });
          routePermissionList.push("quick_order");
        }
        // dinamic offers
        // if(ysFeatures.indexOf('dinamic_offers')!=-1) {
        //   orderList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/orders/dinamic-offers', type: 'link' });
        //   inactiveOrders.push({ name: 'DiNAMIC', state: '/orders/inactive-dinamic-offers', type: 'link' })
        //   routePermissionList.push("inactive_dinamic_offer_orders");
        // }
        // appointments
        if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
          orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
          routePermissionList.push("appointments");
        }
        // inactive orders
        if(inactiveOrders.length>1) orderList.push({ name: 'Failed Payments', type: 'dropDown', icon: 'error_outline', sub:inactiveOrders });
        else orderList.push({ icon: 'error_outline', name: 'Failed Payments', state: '/orders/inactive-orders', type: 'link' });
        // abandoned
        if(ysFeatures.indexOf('abandoned_cart')!=-1 && subuserFeatures.indexOf('abandoned_cart')!=-1) {
          orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', sub: [
            { name: 'Signed Up Users', state: '/abandoned-cart/customer', type: 'link' },
            { name: 'Guest Users', state: '/abandoned-cart/guest-user', type: 'link' }
          ] });
          routePermissionList.push("abandoned_cart");
        }
        // customer
        if(this.commonService.store_details.type == 'order_based' || this.commonService.store_details.type == 'restaurant_based') {
          if(subuserFeatures.indexOf('customers')!=-1) {
            orderList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', sub: [
              { name: 'Signed Up Users', state: '/customers', type: 'link' },
              { name: 'Guest Users', state: '/guest-users', type: 'link' }
            ] });
            routePermissionList.push("customers");
          }
        }
        if(orderList.length) this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
        if(ysFeatures.indexOf('manual_order')!=-1 && subuserFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
      }
      // marketing tools
      let toolList: IChildItem[] = [];
      if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
        if(subuserFeatures.indexOf('offers')!=-1) {
          toolList.push({ icon: 'local_offer', name: 'Offers', state: '/features/coupon-codes', type: 'link' });
          routePermissionList.push("offers");
        }
      }
      if(ysFeatures.indexOf('giftcard')!=-1 && subuserFeatures.indexOf('giftcard')!=-1) {
        toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/features/giftcard', type: 'link' });
        routePermissionList.push("giftcard", "giftcard_orders");
      }
      if(ysFeatures.indexOf('newsletter')!=-1 && subuserFeatures.indexOf('newsletter')!=-1) {
        toolList.push({ icon: 'mail', name: 'Newsletter', state: '/newsletter', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if(ysFeatures.indexOf('customer_feedback')!=-1 && subuserFeatures.indexOf('customer_feedback')!=-1) {
        toolList.push({ icon: 'feedback', name: 'Feedback', state: '/feedback', type: 'link' });
        routePermissionList.push("feedback");
      }
      if(toolList.length) this.sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'build_circle', sub: toolList });
      // website
      let seoList: IChildItem[] = [];
      if(ysFeatures.indexOf('advanced_seo')!=-1 && subuserFeatures.indexOf('seo')!=-1) {
        routePermissionList.push("store_seo", "catalog_seo", "product_seo");
        seoList.push({ name: 'Store', state: '/seo/store', type: 'link' });
        seoList.push({ name: 'Catalog', state: '/seo/catalog', type: 'link' });
        seoList.push({ name: 'Product', state: '/seo/product', type: 'link' });
        if(ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('blogs')!=-1) {
          seoList.push({ name: 'Blog', state: '/seo/blog', type: 'link' });
          routePermissionList.push("blog_seo");
        }
        if(ysFeatures.indexOf('extra_pages')!=-1 && subuserFeatures.indexOf('extra_pages')!=-1) {
          seoList.push({ name: 'Extra Pages', state: '/seo/extra-pages', type: 'link' });
          routePermissionList.push("extra_page_seo");
        }
      }
      let webList: IChildItem[] = [];
      if(subuserFeatures.indexOf('website_design')!=-1) {
        webList.push({
          name: 'Website Design', type: 'dropDown', icon: 'format_paint',
          sub: [
            { name: 'Home Page', state: '/layouts/home', type: 'link' },
            { name: 'Catalog Page', state: '/layouts/catalog', type: 'link' },
            // { name: 'Product Page', state: '/layouts/product', type: 'link' }
          ]
        });
        routePermissionList.push("home_layout", "catalog_layout", "product_layout");
      }
      if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
        if(subuserFeatures.indexOf('menu')!=-1) {
          webList.push({ icon: 'menu_book', name: 'Menu', state: '/features/menus', type: 'link' });
          routePermissionList.push("menus");
        }
      }
      if(subuserFeatures.indexOf('policies')!=-1) {
        webList.push({
          name: 'Policies', type: 'dropDown', icon: 'policy',
          sub: [
            { name: 'Privacy Policy', state: '/setup/policies/privacy', type: 'link' },
            { name: 'Shipping Policy', state: '/setup/policies/shipping', type: 'link' },
            { name: 'Cancellation Policy', state: '/setup/policies/cancellation', type: 'link' },
            { name: 'Terms & Conditions', state: '/setup/policies/terms_conditions', type: 'link' }
          ]
        });
        routePermissionList.push("policies");
      }
      if(seoList.length) webList.push({ name: 'SEO', type: 'dropDown', icon: 'track_changes', sub: seoList });
      else if(ysFeatures.indexOf('basic_seo')!=-1 && subuserFeatures.indexOf('seo')!=-1) {
        webList.push({ name: 'SEO', type: 'link', icon: 'track_changes', state: '/seo/store' });
        routePermissionList.push("store_seo");
      }
      if(subuserFeatures.indexOf('contact_page')!=-1) {
        webList.push({ icon: 'contact_phone', name: 'Contact Page', state: '/setup/contact-page', type: 'link' });
        routePermissionList.push("contact_page");
      }
      if(ysFeatures.indexOf('store_locator')!=-1 && subuserFeatures.indexOf('store_locator')!=-1) {
        webList.push({ icon: 'location_on', name: 'Store Locator', state: '/setup/store-locator', type: 'link' });
        routePermissionList.push("store_locator");
      }
      if(ysFeatures.indexOf('extra_pages')!=-1 && subuserFeatures.indexOf('extra_pages')!=-1) {
        webList.push({ icon: 'note_add', name: 'Extra Pages', state: '/setup/extra-pages', type: 'link' });
        routePermissionList.push("extra_pages");
      }
      if(subuserFeatures.indexOf('footer_configuration')!=-1) {
        webList.push({ icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' });
        routePermissionList.push("footer_content");
      }
      if(webList.length) this.sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'language', sub: webList });
      // store modules
      let moduleList: IChildItem[] = [];
      if(ysFeatures.indexOf('shopping_assistant')!=-1 && subuserFeatures.indexOf('shopping_assistant')!=-1) {
        moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/product-extras/shop-assistant', type: 'link' });
        routePermissionList.push("shopping_assistant");
      }
      if(ysFeatures.indexOf('sizing_assistant')!=-1 && subuserFeatures.indexOf('sizing_assistant')!=-1) {
        moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/product-extras/sizing-assistant', type: 'link' });
        routePermissionList.push("sizing_assistant");
      }
      if(ysFeatures.indexOf('currency_variation')!=-1 && subuserFeatures.indexOf('currency_variation')!=-1) {
        moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setup/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if(ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('blogs')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/features/blogs', type: 'link' });
        routePermissionList.push("blogs");
      }
      if(ysFeatures.indexOf('discounts_page')!=-1 && subuserFeatures.indexOf('discounts_page')!=-1) {
        moduleList.push({ icon: 'local_atm', name: 'Discounts Page', state: '/features/discounts-page', type: 'link' });
        routePermissionList.push("discounts_page");
      }
      if(ysFeatures.indexOf('collections')!=-1 && subuserFeatures.indexOf('collections')!=-1) {
        moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/features/collections', type: 'link' });
        routePermissionList.push("collections");
      }
      // if(ysFeatures.indexOf('dinamic_offers')!=-1) {
      //   moduleList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/features/dinamic-offers', type: 'link' });
      //   routePermissionList.push("dinamic_offers", "dinamic_offer_orders");
      // }
      if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
        moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/features/appointment-categories', type: 'link' });
        routePermissionList.push("appointment_services");
      }
      if(moduleList.length) this.sidePanelList.push({ name: 'Store Modules', type: 'dropDown', icon: 'view_week', sub: moduleList });
      // setting
      let settingList: IChildItem[] = [];
      if(ysFeatures.indexOf('tax_rates')!=-1 && subuserFeatures.indexOf('tax_rates')!=-1) {
        settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/product-extras/tax-rates', type: 'link' });
        routePermissionList.push("tax_rates");
      }
      if(ysFeatures.indexOf('time_based_delivery')!=-1 && subuserFeatures.indexOf('time_based_delivery')!=-1) {
        settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/shipping/delivery-methods', type: 'link' });
        routePermissionList.push("delivery_methods");
      }
      else if(subuserFeatures.indexOf('shipping_methods')!=-1) {
        settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/shipping/shipping-methods', type: 'link' });
        routePermissionList.push("shipping_methods");
      }
      if(ysFeatures.indexOf('pincode_service')!=-1 && subuserFeatures.indexOf('pincode_service')!=-1) {
        settingList.push({ icon: 'fmd_good', name: 'Pincode Service', state: '/shipping/pincodes', type: 'link' });
        routePermissionList.push("pincodes");
      }
      if(subuserFeatures.indexOf('payment_gateway')!=-1) {
        settingList.push({ icon: 'payment', name: 'Payment Gateway', state: '/setup/payment-gateway', type: 'link' });
        routePermissionList.push("payment_gateway");
      }
      if(subuserFeatures.indexOf('store_setting')!=-1) {
        settingList.push({ icon: 'room_preferences', name: 'Store Settings', state: '/store-setting', type: 'link' });
        routePermissionList.push("store_setting");
      }
      if(settingList.length) this.sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'settings', sub: settingList });
      // my account
      let accountList: IChildItem[] = [];
      if(subuserFeatures.indexOf('branches')!=-1) {
        accountList.push({ icon: 'store', name: 'Branches', state: '/account/branches', type: 'link' });
        routePermissionList.push("branches");
      }
      if(ysFeatures.indexOf('vendors')!=-1 && subuserFeatures.indexOf('vendors')!=-1) {
        accountList.push({ icon: 'supervisor_account', name: 'Vendors', state: '/account/vendors', type: 'link' });
        routePermissionList.push("vendors");
      }
      if(accountList.length) this.sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
    }
    // Vendor
    else if(this.commonService.store_details.login_type=='vendor') {
      // dashboard
      routePermissionList.push("vendor_dashboard");
      this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'dashboard', state: '/vendor-dashboard' });
      // products
      routePermissionList.push("products", "product_add", "product_edit");
      this.sidePanelList.push({ name: 'Products', type: 'link', icon: 'category', state: '/products' });
      // orders
      let orderList: IChildItem[] = [
        { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
        { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
        { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
      ];
      routePermissionList.push("orders");
      this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'settings_backup_restore', sub: orderList });
      // ad management
      routePermissionList.push("ad_management");
      this.sidePanelList.push({ name: 'Ad Management', type: 'link', icon: 'public', state: '/features/ad-management' });
      // profile
      routePermissionList.push("vendor_profile");
      this.sidePanelList.push({ name: 'Profile', type: 'link', icon: 'account_circle', state: '/account/vendor-profile' });
    }
    this.commonService.route_permission_list = routePermissionList;
    this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
  }

  resetStoreDetails(result) {
    this.commonService.store_details = {
      type: result.data.type,
      login_email: result.data.email,
      login_type: result.login_type,
      _id: result.data._id,
      name: result.data.name,
      email: result.data.email,
      gst_no: result.data.gst_no,
      website: result.data.website,
      base_url: result.data.base_url,
      sub_domain: result.data.sub_domain,
      currency_types: result.data.currency_types,
      country: result.data.country,
      created_on: result.data.created_on,
      additional_features: result.data.additional_features,
      company_details: result.data.company_details,
      package_details: result.data.package_details,
      package_info: result.data.package_info,
      status: result.data.status
    };
    if(result.data.vendor_commission) this.commonService.store_details.vendor_commission = result.data.vendor_commission;
    if(result.data.dp_wallet_status) this.commonService.store_details.dp_wallet_status = result.data.dp_wallet_status;
    this.commonService.updateLocalData('store_details', this.commonService.store_details);
    // deploy stages
    this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
    this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
    // deploy details
    this.commonService.deploy_details = result.data.deployDetails[0];
    delete this.commonService.deploy_details.deploy_stages;
    this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
    if(result.data.status=='active') {
      // ys features
      this.commonService.ys_features = result.ys_features;
      // trial features
      let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
      if(trialFeatures.length) {
        trialFeatures.forEach(obj => {
          let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
          if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
            this.commonService.ys_features.push(obj.name);
          }
        });
      }
      this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
      this.getSidePanelList();
    }
    else {
      this.commonService.route_permission_list = ["deployment", "billing"];
      this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
      this.router.navigateByUrl('/account/billing');
    }
  }

}