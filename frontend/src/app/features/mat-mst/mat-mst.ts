import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { Material, MatMstService } from '../../core/services/mat-mst';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mat-mst',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    SharedModule,
    DialogModule,
    ConfirmDialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mat-mst.html',
  styleUrl: './mat-mst.scss',
})
export class MatMstComponent implements OnInit {
  materials: Material[] = [];
  materialDialog: boolean = false;
  matForm!: FormGroup;
  isEditMode: boolean = false;
  bulkDialog: boolean = false;
  bulkControl = new FormControl('', Validators.required);

  constructor(
    private matMstService: MatMstService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef, // Injected to manually trigger UI updates
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.initForm();
  }

  initForm(): void {
    this.matForm = this.fb.group({
      MatCode: ['', [Validators.required, Validators.maxLength(50)]],
      MatName: ['', [Validators.required, Validators.maxLength(256)]],
      MatQty: [0, [Validators.required, Validators.min(0)]],
      MatPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadMaterials(showToast: boolean = false): void {
    this.matMstService.getMaterials().subscribe({
      next: (data) => {
        console.log('Database payload received:', data);
        this.materials = data;
        this.cdr.detectChanges(); // Wakes Angular up to redraw the table!

        if (showToast) {
          this.showSuccess('Data reloaded from database');
        }
      },
      error: () => this.showError('Error fetching Materials'),
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.matForm.reset({ MatQty: 0, MatPrice: 0 });
    this.matForm.get('MatCode')?.enable();
    this.materialDialog = true;
  }

  editMaterial(material: Material): void {
    this.isEditMode = true;
    this.matForm.patchValue(material);
    this.matForm.get('MatCode')?.disable();
    this.materialDialog = true;
  }

  hideDialog(): void {
    this.materialDialog = false;
  }

  openBulk(): void {
    this.bulkControl.reset();
    this.bulkDialog = true;
  }

  saveBulk(): void {
    if (this.bulkControl.invalid || !this.bulkControl.value) return;

    const text = this.bulkControl.value.trim();
    const lines = text.split('\n');

    if (lines.length === 0 || !text) {
      this.showError('Please provide at least one data row.');
      return;
    }

    const bulkData: Material[] = [];

    // Process every line directly as data
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',');
      if (cols.length !== 4) {
        this.showError(
          `Row ${i + 1} is invalid. Expected exactly 4 values: MatCode, MatName, MatQty, MatPrice.`,
        );
        return;
      }

      bulkData.push({
        MatCode: cols[0].trim(),
        MatName: cols[1].trim(),
        MatQty: Number(cols[2].trim()) || 0,
        MatPrice: Number(cols[3].trim()) || 0,
      });
    }

    const codes = bulkData.map((m) => m.MatCode);
    const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
    if (dupes.length > 0) {
      this.showError(`Duplicate MatCode(s) in your pasted data: ${[...new Set(dupes)].join(', ')}`);
      return;
    }

    this.matMstService.createBulkMaterials(bulkData).subscribe({
      next: () => {
        this.showSuccess('Mass import successful');
        this.loadMaterials();
        this.bulkDialog = false;
      },
      error: (err: HttpErrorResponse) =>
        this.showError(err.error?.message || 'Error during mass import.'),
    });
  }

  saveMaterial(): void {
    if (this.matForm.invalid) return;

    const materialData = this.matForm.getRawValue();
    if (this.isEditMode) {
      this.matMstService.updateMaterial(materialData).subscribe({
        next: () => {
          this.showSuccess('Material Updated');
          this.loadMaterials();
          this.hideDialog();
        },
        error: () => this.showError('Error updating Material'),
      });
    } else {
      this.matMstService.createMaterial(materialData).subscribe({
        next: () => {
          this.showSuccess('Material Created');
          this.loadMaterials();
          this.hideDialog();
        },
        error: () => this.showError('Error Creating Material'),
      });
    }
  }

  deleteMaterial(material: Material): void {
    this.confirmationService.confirm({
      message: `Are your sure you want to delete ${material.MatName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.matMstService.deleteMaterial(material.MatCode).subscribe({
          next: () => {
            this.showSuccess('Material Deleted');
            this.loadMaterials();
          },
          error: () => this.showError('Error deleting material'),
        });
      },
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: detail,
      life: 3000,
    });
    this.cdr.detectChanges(); // Ensures the toast renders immediately
  }

  private showError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
      life: 3000,
    });
    this.cdr.detectChanges(); // Ensures the toast renders immediately
  }
}
