/** 菜单数据 */
export class MenuData {

    constructor(
        public id: number,
        public name: string,
        public matIcon?: string,
        public url?: string,
        public children?: MenuData[]
    ) { }

}