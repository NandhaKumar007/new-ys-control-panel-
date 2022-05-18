import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class UserInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    // const updatedRequest = request.clone({
    //   headers: request.headers.set("Authorization", "Some-dummyCode")
    // });
    return next.handle(request).pipe(
      tap(event => {
          if(event instanceof HttpResponse) {
            if(event.body && event.body.session_end) {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }
          }
        },
        error => { }
      )
    );
  }
  
}