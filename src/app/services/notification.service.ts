import { Injectable } from '@angular/core';
import {INotification} from "../data-types/notification.model";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifyRequest = new ReplaySubject<INotification>();

  notifyRequest$ = this.notifyRequest.asObservable();
  constructor() { }

  notify(notification: INotification) {
    this.notifyRequest.next(notification);
  }
}
