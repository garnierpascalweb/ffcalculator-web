import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PosLessThanPrtsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pos = control.get('posCtrl')?.value;
  const prts = control.get('prtsCtrl')?.value;

  if (pos != null && prts != null && pos > prts) {
    return { posGreaterThanPrts: true };
  }

  return null;
};