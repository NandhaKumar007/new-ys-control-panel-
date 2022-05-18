import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})

export class PoliciesComponent implements OnInit {

  params: any; pageLoader: boolean;
  formData: any = {}; editForm: any = {};

  constructor(private activeRoute: ActivatedRoute, private api: SetupService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params; delete this.editForm;
      this.api.POLICY_DETAILS(this.params.type).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) this.formData = result.data;
        else {
          let policyTitle = "PRIVACY POLICY";
          if(this.params.type=='shipping') policyTitle = "SHIPPING POLICY";
          else if(this.params.type=='cancellation') policyTitle = "CANCELLATION POLICY";
          else if(this.params.type=='terms_conditions') policyTitle = "TERMS AND CONDITIONS";
          this.formData = { type: this.params.type, title: policyTitle };
        }
      });
    });
  }

  onEdit() {
    this.editForm = { type: this.formData.type, title: this.formData.title, content: "" };
    if(this.formData._id) this.editForm = { type: this.formData.type, title: this.formData.title, content: this.formData.content };
  }
  onUpdate() {
    this.api.UPDATE_POLICY(this.editForm).subscribe(result => {
      if(result.status) this.ngOnInit();
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  cancel() {
    delete this.editForm;
  }

}