import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {

  public readonly messages$ = this.messageService.messages$;

  constructor(
    @Inject(MessageService) private readonly messageService: MessageService,
  ) { }

  public clearMessages(): void {
    this.messageService.clear();
  }

}
