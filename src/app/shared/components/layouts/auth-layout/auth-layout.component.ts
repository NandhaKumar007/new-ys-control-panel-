import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})

export class AuthLayoutComponent implements OnInit {

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit() {
  }

}