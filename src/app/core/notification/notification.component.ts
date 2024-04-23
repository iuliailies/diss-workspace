import { Component, OnInit } from '@angular/core';
import { INotification } from '../../data-types/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.sass',
})
export class NotificationComponent implements OnInit {
  notifications: INotification[] = [];
  counter: number = 0;
  constructor(public notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifyRequest$.subscribe(
      (notification: INotification) => {
        const id = this.counter++;
        this.notifications.push({ ...notification, id });

        setTimeout(() => {
          this.notifications = this.notifications.filter(
            (notification) => notification.id !== id,
          );
        }, 3000);
      },
    );
  }
}
