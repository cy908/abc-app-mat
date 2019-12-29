/** 主题 */
export class Theme {

    constructor(
        public name: string,
        public style: string,
        public primary: string,
        public accent: string,
        public checked: boolean = false,
    ) { }

}

/** 主题 */
export const THEMES: Theme[] = [
    new Theme('深紫 - 琥珀', 'deeppurple-amber', '#673AB7', '#FFC107'),
    new Theme('靛蓝 - 粉色', 'indigo-pink', '#3F51B5', '#E91E63'),
    new Theme('粉红 - 蓝灰', 'pink-bluegrey', '#E91E63', '#607D8B'),
    new Theme('紫色 - 绿色', 'purple-green', '#9C27B0', '#4CAF50'),
];
