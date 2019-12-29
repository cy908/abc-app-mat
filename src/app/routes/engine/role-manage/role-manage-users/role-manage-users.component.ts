import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { slideToLeft } from 'src/app/shared/animations';
import { DialogService } from 'src/app/core/dialog';
import { TreeComponent, TreeNode } from 'src/app/shared/tree';
import { ResultData } from '../../engine-model';
import { Department } from '../../department-manage';
import { User } from '../../user-manage';
import { RoleManageUrl } from '../role-manage-url';
import { Role, RoleUser } from '../role-model';

@Component({
  selector: 'app-role-manage-users',
  templateUrl: './role-manage-users.component.html',
  styleUrls: ['./role-manage-users.component.scss'],
  animations: [slideToLeft()]
})
export class RoleManageUsersComponent {

  @ViewChild(TreeComponent, { static: true })
  tree: TreeComponent;

  private departmentIcon = 'work';
  private userIcon = 'person';

  loading = false;
  roleId = 0;
  role: Role = null;
  departments: Department[] = null;
  users: User[] = null;
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
          this.getDepartments();
        }
      });
  }

  private getDepartments() {
    const url = RoleManageUrl.URL_ROLE_DEPARTMENTS;
    this.loading = true;
    this.http.get<Department[]>(url)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.departments = data;
        this.getUsers();
      });
  }

  private getUsers() {
    let role = new Role();
    role.id = this.roleId;
    const url = RoleManageUrl.URL_ROLE_USERS;
    this.loading = true;
    this.http.post<User[]>(url, role)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.users = data;
        this.initTree();
      });
  }

  private saveRoleUser() {
    let title = '确认保存？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let roleUsers = this.getCheckedNode();
        const url = RoleManageUrl.URL_ROLE_USERS_SAVE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, roleUsers)
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

  private getCheckedNode(): RoleUser[] {
    let roleUsers: RoleUser[] = [];
    let selected = this.tree.getSelected();
    if (!selected || selected.length == 0) {
      roleUsers.push(new RoleUser(this.role.id, 0));
    } else {
      selected.forEach(item => {
        roleUsers.push(new RoleUser(this.role.id, item.id));
      });
    }
    return roleUsers;
  }

  goSave() {
    this.saveRoleUser();
  }

  goBack() {
    history.back();
  }

  private initTree() {
    if (this.departments == null || this.departments.length == 0) {
      return;
    }
    this.treeNodes = this._initTree(this.departments, 0, this.departmentIcon, false);
    this.tree.setData(this.treeNodes);
  }

  private _initTree(objs: any[], level: number, icon: string, isUser: boolean): TreeNode[] {
    if (!objs) { return []; }
    return objs.reduce<TreeNode[]>((accumulator, obj) => {
      let node = new TreeNode();
      node.id = obj.id;
      node.name = obj.name;
      node.icon = icon;
      if (!isUser) {
        node.color = 'primary';
      } else {
        node.color = 'accent';
      }
      node.checked = obj.checked;
      const children = obj.children;
      if (children) {
        node.children = this._initTree(children, level + 1, this.departmentIcon, false);
      }
      node.level = level;
      node.needBack = isUser;
      if (this.users && !isUser) {
        let users = this._initTree(this._getUser(node.id), level + 1, this.userIcon, true);
        if (users && users.length > 0) {
          if (!node.children) {
            node.children = [];
          }
          node.children.push(...users);
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  private _getUser(id: number): User[] {
    return this.users.filter(item => item.departmentId === id);
  }

}
