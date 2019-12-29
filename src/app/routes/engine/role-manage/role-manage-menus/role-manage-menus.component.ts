import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { slideToLeft } from 'src/app/shared/animations';
import { DialogService } from 'src/app/core/dialog';
import { TreeComponent, TreeNode } from 'src/app/shared/tree';
import { ResultData } from '../../engine-model';
import { Menu } from '../../menu-manage';
import { RoleManageUrl } from '../role-manage-url';
import { Role, RoleMenu } from '../role-model';

@Component({
  selector: 'app-role-manage-menus',
  templateUrl: './role-manage-menus.component.html',
  styleUrls: ['./role-manage-menus.component.scss'],
  animations: [slideToLeft()]
})
export class RoleManageMenusComponent implements OnInit {

  @ViewChild(TreeComponent, { static: true })
  tree: TreeComponent;

  loading = false;
  roleId = 0;
  role: Role = null;
  menus: Menu[] = null;
  treeNodes: TreeNode[] = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialogSrv: DialogService,
  ) { }

  ngOnInit() {
    this.roleId = +this.route.snapshot.paramMap.get('id');
    this.getRole();
  }

  private getRole() {
    if (this.loading) {
      return;
    }
    let role = new Role();
    role.id = this.roleId;
    const url = RoleManageUrl.URL_ROLE_INFO;
    this.loading = true;
    this.http.post<Role>(url, role)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.role = data;
        if (this.role != null) {
          this.getMenus();
        }
      });
  }

  private getMenus() {
    if (this.loading) {
      return;
    }
    let role = new Role();
    role.id = this.roleId;
    const url = RoleManageUrl.URL_ROLE_MENUS;
    this.loading = true;
    this.http.post<Menu[]>(url, role)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.menus = data;
        this.initTree();
      });
  }

  private saveRoleUser() {
    let title = '确认保存？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let roleMenus = this.getCheckedNode();
        const url = RoleManageUrl.URL_ROLE_MENUS_SAVE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, roleMenus)
          .pipe(tap(
            () => this.loading = false,
            () => this.loading = false))
          .subscribe(data => {
            if (data.success) {
              this.goBack();
            }
          });
      }
    });
  }

  private getCheckedNode(): RoleMenu[] {
    let roleMenus: RoleMenu[] = [];
    let selected = this.tree.getSelected();
    if (!selected || selected.length == 0) {
      roleMenus.push(new RoleMenu(this.role.id, 0));
    } else {
      selected.forEach(item => {
        roleMenus.push(new RoleMenu(this.role.id, item.id));
      });
    }
    return roleMenus;
  }

  goBack() {
    history.back();
  }

  goSave() {
    this.saveRoleUser();
  }

  private initTree() {
    if (this.menus == null || this.menus.length == 0) {
      return;
    }
    this.treeNodes = this._initTree(this.menus, 0);
    this.tree.setData(this.treeNodes);
  }

  private _initTree(objs: any[], level: number): TreeNode[] {
    if (!objs) { return []; }
    return objs.reduce<TreeNode[]>((accumulator, obj) => {
      let node = new TreeNode();
      node.id = obj.id;
      node.name = obj.name;
      node.icon = obj.matIcon;
      const order = obj.order;
      if (order.length == obj.orderTopSize) {
        node.color = 'primary';
      } else if (order.length == obj.orderTopSize * 2) {
        node.color = 'accent';
      } else if (order.length > obj.orderTopSize * 2) {
        node.color = 'warn';
      }
      node.checked = obj.checked;
      const children = obj.children;
      if (children) {
        node.children = this._initTree(children, level + 1);
      }
      node.level = level;
      node.needBack = true;
      return accumulator.concat(node);
    }, []);
  }

}
