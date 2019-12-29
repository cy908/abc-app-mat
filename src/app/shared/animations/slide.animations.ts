import { animate, style, transition, trigger } from '@angular/animations';

export function slideToTop() {
    return trigger('slideToTop', [
        transition(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateY(-100%)' }))
        ]),
    ]);
}

export function slideToBottom() {
    return trigger('slideToBottom', [
        transition(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateY(100%)' }))
        ]),
    ]);
}

export function slideToLeft() {
    return trigger('slideToLeft', [
        transition(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' }))
        ]),
    ]);
}

export function slideToRight() {
    return trigger('slideToRight', [
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
        ]),
    ]);
}