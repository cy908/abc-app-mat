/** 树节点 */
export class TreeNode {

    constructor(
        public id?: number,
        public name?: string,
        public icon?: string,
        public color?: string,
        public checked?: boolean,
        public children?: TreeNode[],
        public level?: number,
        public needBack?: boolean,
    ) { }

}