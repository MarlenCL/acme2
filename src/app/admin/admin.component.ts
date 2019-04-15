import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService, UserService, AuthService } from '../service';
import { ConfirmationService, Message, SortEvent } from 'primeng/api';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { AuthorityService } from '../service/authority.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Authority } from '../shared/models/authority.model.';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  form: any;

  cols: { field: string; header: string; }[];
  msgs: Message[] = [];
  users: User[];
  authorities: Authority[];

  visible: boolean = true;
  submitted = false;
  displayDialog: boolean;

  selectedAuthority: Authority;
  selectedUser: User = {};
  newselectedUser: boolean;

  constructor(
    private config: ConfigService,
    private userService: UserService,
    protected http: HttpClient,
    protected confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService,
    private authorityService: AuthorityService,
    private formBuilder: FormBuilder
  ) {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      firstname: new FormControl("", Validators.required),
      password: new FormControl(""),
      repeatPassword: new FormControl(""),
      permission: new FormControl(),
    });
  }

  ngOnInit() {
    this.findAllAuthorities();
    this.findAllUsers();
    this.cols = [
      { field: 'firstname', header: 'Name' },
      { field: 'authority', header: 'Rol' }
    ];
  }

  findAllUsers(): void {
    this.userService.getAll()
      .map(res => res)
      .subscribe((result: any) => {
        this.users = result;
        this.users.forEach(user => {
          var authorityi = user.rol.name.split("_")[1];
          user.authority = authorityi.toUpperCase();
        });
      })
  }

  findAllAuthorities(): void {
    this.authorityService.getAll()
      .map(res => res)
      .subscribe((result: any) => {
        this.authorities = result;
        this.selectedAuthority = this.authorities[0];
      });
  }

  customSort(event) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

  showDialogToAdd() {
    this.newselectedUser = true;
    this.selectedUser = {};
    this.form.get('repeatPassword').setValidators(Validators.required);
    this.form.get('password').setValidators(Validators.required);
    this.form.get('password').updateValueAndValidity();
    this.form.get('repeatPassword').updateValueAndValidity();
    this.form.get('username').setValidators(Validators.required);
    this.form.get('username').updateValueAndValidity();
    this.displayDialog = true;
  }

  save(a: any) {
    let users = [...this.users];
    if (this.newselectedUser)
      this.signUp();
    else
      this.edit();
  }

  delete() {
    var selectedUser: any = this.selectedUser;
    this.confirmationService.confirm({
      message: 'Do you want to delete this User?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
        var firstname = selectedUser.firstname;
        this.userService.remove(selectedUser).subscribe(
          response => {
            this.msgs.push({
              severity: 'success',
              summary: 'User deleted',
              detail: `${firstname} deleted succesfully`
            });
            this.reload();
          },
          error => this.msgs.push({
            severity: 'error',
            summary: 'Error deleting User',
            detail: `${firstname} cannot be deleted`
          })
        );
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  onRowSelect(event) {
    this.newselectedUser = false;
    this.selectedUser = this.cloneselectedUser(event.data);
    this.form.get('repeatPassword').clearValidators();
    this.form.get('repeatPassword').updateValueAndValidity();
    this.form.get('password').clearValidators();
    this.form.get('password').updateValueAndValidity();
    this.form.get('username').clearValidators();
    this.form.get('username').updateValueAndValidity();
    if (this.selectedUser.id == this.userService.currentUser.id) {
      this.form.get('permission').disable();
    } else {
      this.form.get('permission').enable();
    }
    // this is to rerun form validation after removing the validation for a field.
    this.displayDialog = true;

  }

  cloneselectedUser(c: User): User {
    let selectedUser = {};
    for (let prop in c) {
      selectedUser[prop] = c[prop];
    }
    return selectedUser;
  }

  reload(): void {
    this.findAllUsers();
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
    this.selectedUser = null;
    this.displayDialog = false;
  }

  edit(): void {
    this.selectedUser.rol = this.selectedAuthority;
    this.userService.edit(this.selectedUser.id, this.selectedUser).subscribe(
      response => {
        this.msgs.push({
          severity: 'success',
          summary: 'User updated',
        });
        this.reload();
      },
      error => this.msgs.push({
        severity: 'error',
        summary: 'Error updating User',
      })
    );
  }

  public mostrar() {
    document.getElementById("gif").style.display = "block"
  }

  public ocultar() {
    this.displayDialog = false;
  }

  signUp() {
    this.mostrar();
    this.ocultar();
    this.authService.signup(this.selectedUser)
      .subscribe(
        response => {
          this.msgs.push({
            severity: 'success',
            summary: 'User add',
            detail: `${this.selectedUser.firstname} Add succesfully`
          });
          this.reload();
          document.getElementById("gif").style.display = "none"
        },
        error => this.msgs.push({
          severity: 'error',
          summary: 'Error SignUp User'
        })
      );
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.selectedUser.username = reader.result.split(',')[1];
      };
    }
  }
}
