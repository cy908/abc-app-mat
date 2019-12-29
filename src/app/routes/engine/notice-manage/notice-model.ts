import { PageInfo } from '../engine-model';

/** 通知 */
export class Notice implements PageInfo {

    constructor(
        public id?: number,
        public title?: string,
        public content?: string,
        public startTime?: string,
        public endTime?: string,
        public enable?: boolean,
        // 扩展
        public pageIndex?: number,
        public pageSize?: number,
        public departments?: NoticeDepartment[],
        // 参数
        public departmentId?: number,
        public search?: string,
    ) { }

}

/** 通知部门 */
export class NoticeDepartment {

    constructor(
        public noticeId?: number,
        public departmentId?: number
    ) { }

}