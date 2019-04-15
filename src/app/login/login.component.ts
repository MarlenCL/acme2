import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DisplayMessage } from '../shared/models/display-message';
import { Subscription } from 'rxjs/Subscription';
import { UserService, AuthService } from '../service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/SUbject';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import { MAY } from '@angular/material';
declare var window: any;
declare var tracking: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  title = 'Login';
  form: FormGroup;

  public captures: Array<any>;

  submitted = false;

  notification: DisplayMessage;

  returnUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.captures = [];
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.form = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToUrl() {
    if (JSON.stringify(this.userService.currentUser).search('ROLE_ADMIN') !== -1) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    console.log(this.capture());
    this.form.value.username = this.capture();
    this.notification = undefined;
    this.submitted = true;
    this.showGif();
    this.authService.login(this.form.value)
      .delay(1000)
      .subscribe(data => {
        this.hideGift();
        this.goToUrl();
      },
        error => {
          this.hideGift();
          this.submitted = false;
          this.notification = { msgType: 'error', msgBody: 'Incorrect username or password.' };
        });
  }

  public ngAfterViewInit() {
    this.tracking();
  }

  public showGif() {
    document.getElementById("gif").style.display = "block";
    document.getElementById("gif1").style.display = "block";
    document.getElementById("mat-card").style.display = "none";
  }

  public hideGift() {
    document.getElementById("mat-card").style.display = "block";
    document.getElementById("gif").style.display = "none";
    document.getElementById("gif1").style.display = "none";
  }

  public capture(): string {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    var x = parseInt(canvas.getAttribute("x"));
    var y = parseInt(canvas.getAttribute("y"));
    var w = parseInt(canvas.getAttribute("ancho"));
    var h = parseInt(canvas.getAttribute("altura"));

    var context = (<HTMLCanvasElement>canvas).getContext('2d').drawImage((<HTMLCanvasElement>video), x * 2, y * 2, w * 2, h * 2, x, y, w, h);
    this.captures.push((<HTMLCanvasElement>canvas).toDataURL("image/png"));
    var base64 = (<HTMLCanvasElement>canvas).toDataURL("image/png");
    return base64;
  }

  public tracking() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = (<HTMLCanvasElement>canvas).getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#video', tracker, { camera: true });
    tracker.on('track', function (event) {
      context.clearRect(0, 0, (<HTMLCanvasElement>canvas).width, (<HTMLCanvasElement>canvas).height);
      event.data.forEach(function (rect) {
        context.strokeStyle = '#ff0c0c';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);

        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        canvas.setAttribute("altura", rect.height)
        canvas.setAttribute("x", rect.x)
        canvas.setAttribute("y", rect.y)
        canvas.setAttribute("ancho", rect.width)
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

      });
    });
  }
}
