import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
//Тухайн бүрэлдэхүүнд хамаарах модулийг ашиглахын тулд тухайн модулийг импортлох шаардлагатай.

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatListModule,
  MatGridListModule,
  MatSelectModule,
  MatDialogModule
];
//Энэ массив нь импортоор оруулсан Material модулиудыг агуулж байна.
//Ингэснээр импорт, экспорт хийхдээ олон удаа бичих шаардлагагүй болдог.

@NgModule({
  imports: materialModules,
  exports: materialModules,
})
//@NgModule декоратор ашиглан MaterialModule нэртэй шинэ модуль үүсгэж байна.
// imports: Material модулиудыг уг модульд ашиглахын тулд импортолж байна.
// exports: Бусад модулиудад ашиглах боломжтой болгож экспортлож байна.

export class MaterialModule { }
