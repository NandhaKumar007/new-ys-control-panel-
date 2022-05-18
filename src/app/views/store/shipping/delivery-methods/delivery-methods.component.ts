import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ShippingService } from '../shipping.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { element } from 'protractor';

@Component({
  selector: 'app-delivery-methods',
  templateUrl: './delivery-methods.component.html',
  styleUrls: ['./delivery-methods.component.scss'],
  animations: [SharedAnimations]
})

export class DeliveryMethodsComponent implements OnInit {

  params: any; pageLoader: boolean;
  list: any = []; btnLoader: boolean;
  deliveryForm: any; deliveryDetails: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ShippingService, private atp: AmazingTimePickerService,
    private router: Router, private activeRoute: ActivatedRoute, public commonService:CommonService, private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.api.DELIVERY_METHODS().subscribe(result => {
        if(result.status) {
          this.deliveryForm = result.data;
          this.deliveryForm.list.forEach(list => {
            if(list.status=='active') list.list_checked = true;
            list.groups.forEach(group => {
              if(group.status=='active') group.group_checked = true;
              group.slots.forEach(slot => { if(slot.status=='active') slot.slot_checked = true; });
            });
          });
          // bind data
          this.deliveryDetails = { available_days: [], list: [] };
          this.deliveryForm.available_days.forEach(obj => {
            if(obj.active) this.deliveryDetails.available_days.push(obj.day);
          });
          let filterList = this.deliveryForm.list.filter(element => element.list_checked);
          if(filterList.length) {
            filterList.forEach((li, liIndex) => {
              this.deliveryDetails.list.push({ name: li.name, groups: [] });
              let filterGroup = li.groups.filter(grp => grp.group_checked);
              if(filterGroup.length) {
                filterGroup.forEach((grp, grpIndex) => {
                  this.deliveryDetails.list[liIndex].groups.push({ name: grp.name, slots: [] });
                  let filterSlots = grp.slots.filter(sl => sl.slot_checked);
                  if(filterSlots.length) this.deliveryDetails.list[liIndex].groups[grpIndex].slots = filterSlots;
                });
              }
            });
          }
        }
        else {
          this.list = [];
          this.deliveryForm = {
            available_days: [
              { code: 0, day: "Sunday", active: false }, { code: 1, day: "Monday", active: false },
              { code: 2, day: "Tuesday", active: false }, { code: 3, day: "Wednesday", active: false },
              { code: 4, day: "Thursday", active: false }, { code: 5, day: "Friday", active: false },
              { code: 6, day: "Saturday", active: false }
            ],
            list: [
              {
                list_checked: true,
                groups: [
                  {
                    group_checked: true,
                    delay_type: "hour",
                    slots: [{ slot_checked: true }]
                  }
                ]
              }
            ]
          };
          console.log("response", result);
        }
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onUpdate() {
    this.btnLoader = true;
    this.api.UPDATE_DELIVERY_METHODS(this.deliveryForm).subscribe(result => {
      this.updateDeployStatus();
      this.btnLoader = false;
      if(result.status) this.router.navigate(['/shipping/delivery-methods']);
      else {
        this.deliveryForm.errorMsg = result.message;
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

  timePicker(i, j, k, paramName) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.deliveryForm.list[i].groups[j].slots[k][paramName] = this.commonService.timeConversion(time);
    });
  }
  secondaryTimePicker(i, j, paramName) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.deliveryForm.list[i].groups[j][paramName] = this.commonService.timeConversion(time);
    });
  }

}