import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ShippingService } from '../shipping.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss'],
  animations: [SharedAnimations]
})

export class ShippingMethodsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  shippingForm: any; deleteForm: any;
  list: any = [];
  pageLoader: boolean;
  deliveryPartners: any = [
    { name: "Delhivery", tracking_link: "https://www.delhivery.com/track/package/" }
  ];

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ShippingService, public commonService: CommonService, private deployApi: DeploymentService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.SHIPPING_LIST().subscribe(result => {
      if(result.status) {
        this.commonService.shipping_list = result.list.filter(obj => obj.status=='active');
        this.commonService.updateLocalData('shipping_list', this.commonService.shipping_list);
        this.list = result.list.filter(obj => !obj.vendor_id);
        this.commonService.vendor_list.forEach(el => {
          el.shipping_list = result.list.filter(obj => obj.vendor_id==el._id);
        });
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    if(this.shippingForm.formType=='add') {
      this.api.ADD_SHIPPING(this.shippingForm).subscribe(result => {
        this.updateDeployStatus();
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.shippingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_SHIPPING(this.shippingForm).subscribe(result => {
        this.updateDeployStatus();
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.shippingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // Edit
  onEdit(x, modalName) {
    this.api.SHIPPING_DETAILS(x).subscribe(result => {
      if(result.status) {
        this.shippingForm = result.data;
        this.shippingForm.formType = 'update';
        if(!this.shippingForm.dp_config) this.shippingForm.dp_config = {};
        if(!this.shippingForm.dp_name) this.shippingForm.dp_name = "";
        this.modalService.open(modalName, {size: 'lg'});
      }
      else console.log("response", result);
    });
  }

  onUpdateStatus() {
    if(this.deleteForm.exist_status=='active') this.deleteForm.status='inactive';
    else this.deleteForm.status='active';
    this.api.UPDATE_SHIPPING({ _id: this.deleteForm._id, status: this.deleteForm.status }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.error_msg = result.message;
      }
    });
  }

  // Delete
  onDelete() {
    this.api.DELETE_SHIPPING(this.deleteForm).subscribe(result => {
      this.updateDeployStatus();
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['shipping']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.shipping": true };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  onChangeCP() {
    if(this.shippingForm.dp_name) {
      let dIndex = this.deliveryPartners.findIndex(obj => obj.name==this.shippingForm.dp_name);
      if(dIndex!=-1) this.shippingForm.tracking_link = this.deliveryPartners[dIndex].tracking_link;
    }
  }

}