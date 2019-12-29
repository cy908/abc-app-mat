import { animate, state, style, transition, trigger } from '@angular/animations';

export function fadeInOut() {
    return trigger('fadeInOut', [
        state('void', style({ opacity: 0 })),
        state('*', style({ opacity: 1 })),
        transition(':enter', animate('300ms ease-in')),
        transition(':leave', animate('300ms ease-out')),
    ]);
}