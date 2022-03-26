import { Component } from "@angular/core";
import { Message } from './message.model';
import { MessageService } from './message.service';
import { Observable } from "rxjs";
import { trigger, state, style, animate, transition, sequence } from '@angular/animations';

@Component({
    selector: "paMessages",
    templateUrl: "message.component.html",
    animations:[
        trigger('EnterLeave', [
            state('flyIn', style({ transform: 'translateX(0)' })),
            transition('void => *', [
                style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
                sequence([
                  animate('0.3s 0.1s ease', style({
                    transform: 'translateX(0)',
                    width: 120
                  })),
                  animate('0.3s ease', style({
                    opacity: 1
                  }))
                ])
              ]),
            // transition(':enter', [
            //   style({ transform: 'translateX(-100%)' }),
            //   animate('0.5s 300ms ease-in')
            // ]),
            // transition(':leave', [
            //   animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
            // ])
          ])
    ]
})

export class MessageComponent {
    lastMessage: Message;

    constructor(messageService: MessageService) {
        messageService.messages.subscribe(m => {
          this.lastMessage = m;
          setTimeout(() => this.lastMessage=null,2000);
    })
}

}

