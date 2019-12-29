import { Component, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

import { TreeNode } from './tree-model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  dataChange = new BehaviorSubject<TreeNode[]>([]);

  treeControl: FlatTreeControl<TreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, TreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, TreeNode>;
  selection = new SelectionModel<TreeNode>(true);

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => !!node.children;
  getChildren = (node: TreeNode): TreeNode[] => node.children;
  hasChild = (_: number, node: TreeNode) => !!node.children;
  transformer = (node: TreeNode, _: number) => node;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
      if (!!this.dataSource.data && this.dataSource.data.length > 0) {
        this._setSelect(this.dataSource.data);
        this.expandAll();
      }
    });
  }

  ngOnInit() {
  }

  setData(data: TreeNode[]) {
    this.dataChange.next(data);
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }

  getSelected(): TreeNode[] {
    if (!this.dataSource.data) {
      return null;
    }
    let selected: TreeNode[] = [];
    this._getSelected(this.dataSource.data, selected);
    return selected.length == 0 ? null : selected;
  }

  private _setSelect(data: TreeNode[]) {
    data.forEach(item => {
      if (item.children) {
        this._setSelect(item.children);
      } else if (item.checked) {
        this.leafItemSelectionToggle(item);
      }
    });
  }

  private _getSelected(data: TreeNode[], selected: TreeNode[]) {
    data.forEach(item => {
      if (item.needBack && (this.selection.isSelected(item)
        || this.descendantsPartiallySelected(item))) {
        selected.push(item);
      }
      if (item.children) {
        this._getSelected(item.children, selected);
      }
    });
  }

  descendantsAllSelected(node: TreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.selection.isSelected(child)
    );
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  itemSelectionToggle(node: TreeNode): void {
    this.selection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.selection.isSelected(node)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);
    descendants.every(child =>
      this.selection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  leafItemSelectionToggle(node: TreeNode): void {
    this.selection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TreeNode): void {
    let parent: TreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TreeNode): void {
    const nodeSelected = this.selection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.selection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.selection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.selection.select(node);
    }
  }

  getParentNode(node: TreeNode): TreeNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}
