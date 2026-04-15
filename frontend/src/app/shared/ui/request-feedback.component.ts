import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RequestState } from '../models/request-state.model';

@Component({
  selector: 'app-request-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feedback" *ngIf="state.loading">Cargando...</div>
    <div class="feedback feedback-error" *ngIf="!state.loading && state.error">{{ state.error }}</div>
    <div class="feedback feedback-empty" *ngIf="!state.loading && state.empty">{{ emptyLabel }}</div>
    <div class="feedback feedback-success" *ngIf="!state.loading && state.success">{{ state.success }}</div>
  `,
  styles: `
    .feedback { margin: 0.5rem 0; padding: 0.625rem 0.75rem; border-radius: 8px; background: #f4f5f7; }
    .feedback-error { background: #ffe8e8; color: #8f1a1a; }
    .feedback-success { background: #e7f6ec; color: #166534; }
    .feedback-empty { background: #eef2ff; color: #273b7a; }
  `
})
export class RequestFeedbackComponent {
  @Input() state: RequestState = { loading: false };
  @Input() emptyLabel = 'Sin datos para mostrar';
}
