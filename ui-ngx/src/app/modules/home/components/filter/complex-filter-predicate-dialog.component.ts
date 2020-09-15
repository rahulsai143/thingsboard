///
/// Copyright © 2016-2020 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, Inject, OnInit, SkipSelf } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogComponent } from '@app/shared/components/dialog.component';
import {
  BooleanOperation, booleanOperationTranslationMap,
  ComplexFilterPredicate, ComplexFilterPredicateInfo, ComplexOperation, complexOperationTranslationMap,
  EntityKeyValueType,
  FilterPredicateType, KeyFilterPredicateInfo
} from '@shared/models/query/query.models';

export interface ComplexFilterPredicateDialogData {
  complexPredicate: ComplexFilterPredicateInfo;
  key: string;
  readonly: boolean;
  isAdd: boolean;
  valueType: EntityKeyValueType;
  displayUserParameters: boolean;
}

@Component({
  selector: 'tb-complex-filter-predicate-dialog',
  templateUrl: './complex-filter-predicate-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: ComplexFilterPredicateDialogComponent}],
  styleUrls: []
})
export class ComplexFilterPredicateDialogComponent extends
  DialogComponent<ComplexFilterPredicateDialogComponent, ComplexFilterPredicateInfo>
  implements OnInit, ErrorStateMatcher {

  complexFilterFormGroup: FormGroup;

  complexOperations = Object.keys(ComplexOperation);
  complexOperationEnum = ComplexOperation;
  complexOperationTranslations = complexOperationTranslationMap;

  isAdd: boolean;

  submitted = false;

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: ComplexFilterPredicateDialogData,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<ComplexFilterPredicateDialogComponent, ComplexFilterPredicateInfo>,
              private fb: FormBuilder) {
    super(store, router, dialogRef);

    this.isAdd = this.data.isAdd;

    this.complexFilterFormGroup = this.fb.group(
      {
        operation: [this.data.complexPredicate.operation, [Validators.required]],
        predicates: [this.data.complexPredicate.predicates, [Validators.required]]
      }
    );
    if (this.data.readonly) {
      this.complexFilterFormGroup.disable({emitEvent: false});
    }
  }

  ngOnInit(): void {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.submitted = true;
    if (this.complexFilterFormGroup.valid) {
      const predicate: ComplexFilterPredicateInfo = this.complexFilterFormGroup.getRawValue();
      predicate.type = FilterPredicateType.COMPLEX;
      this.dialogRef.close(predicate);
    }
  }
}