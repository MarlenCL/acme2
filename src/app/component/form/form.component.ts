import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  displayDialog: boolean;

  constructor( private router: Router ) { }

  ngOnInit() { }
  display: boolean = true;

  showDialog() {
      this.display = false;
  }


}
