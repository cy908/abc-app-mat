import { NgModule } from '@angular/core';

import {
  // Form Controls
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  // Navigation
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  // Layout
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatStepperModule,
  MatTabsModule,
  MatTreeModule,
  // Buttons & Indicators
  MatButtonModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatRippleModule,
  // Popups & Modals
  MatBottomSheetModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTooltipModule,
  // Data table
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  // Date
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  // Other
  MatPaginatorIntl,
} from '@angular/material';

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';

export function getPaginatorIntl() {
  const paginator = new MatPaginatorIntl();
  paginator.itemsPerPageLabel = '每页条数';
  paginator.previousPageLabel = '上一页';
  paginator.nextPageLabel = '下一页';
  paginator.firstPageLabel = '首页';
  paginator.lastPageLabel = '末页';
  paginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `第 0 条、共 ${length} 条`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `第 ${startIndex + 1} - ${endIndex} 条、共 ${length} 条`;
  };
  return paginator;
}

@NgModule({
  declarations: [],
  imports: [
    // Form Controls
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    // Navigation
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    // Layout
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    // Buttons & Indicators
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    // Popups & Modals
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    // Data table
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    // Date
    MatNativeDateModule,
    // CDK
    A11yModule,
    BidiModule,
    DragDropModule,
    LayoutModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollingModule,
    TextFieldModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
  ],
  exports: [
    // Form Controls
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    // Navigation
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    // Layout
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    // Buttons & Indicators
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    // Popups & Modals
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    // Data table
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    // Date
    MatNativeDateModule,
    // CDK
    A11yModule,
    BidiModule,
    DragDropModule,
    LayoutModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollingModule,
    TextFieldModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-Hans' },
    { provide: MatPaginatorIntl, useValue: getPaginatorIntl() },
  ]
})
export class MaterialModule { }
