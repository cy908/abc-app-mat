/** 消息数据 */
export class MessageData {

    constructor(
        public icon: MessageIcon,
        public color: MessageColor,
        public message: string,
    ) { }

}

/** 消息图标 */
export enum MessageIcon {
    PRIMARY = 'check',
    ACCENT = 'info',
    WARN = 'error',
}

/** 图标颜色 */
export enum MessageColor {
    PRIMARY = 'primary',
    ACCENT = 'accent',
    WARN = 'warn',
}
