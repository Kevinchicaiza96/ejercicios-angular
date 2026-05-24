import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EmpleadoService, Empleado } from './empleado';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  imports: [
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    MatDialogModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  empleados: Empleado[] = [];
  busqueda: string = '';
  form: FormGroup;
  nextId: number = 100;
  displayedColumns = ['name', 'email', 'phone', 'accion'];

  constructor(
    private empleadoService: EmpleadoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      name:  ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.empleadoService.getEmpleados()
        .subscribe(data => {
          this.empleados = data;
          this.cdr.detectChanges();
        });
    }
  }

  get empleadosFiltrados(): Empleado[] {
    return this.empleados.filter(e =>
      e.name.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  agregar(): void {
  if (this.form.valid) {
    this.empleados.push({ id: this.nextId++, ...this.form.value });
    this.form.reset({ name: '', email: '', phone: '' });
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.setErrors(null);
    });
    this.cdr.detectChanges();
    this.snackBar.open('Empleado agregado correctamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snack-success']
    });
  } else {
    this.form.markAllAsTouched();
  }
}

  eliminar(id: number): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de que deseas eliminar este empleado?' }
    });

    ref.afterClosed().subscribe(confirmado => {
      if(confirmado) {
        this.empleados = this.empleados.filter(e => e.id !== id);
        this.cdr.detectChanges();
        this.snackBar.open('Empleado eliminado', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snack-warn'],
        });
      }
    });
  }

  getColor(name: string): string {
    const colors = ['#1976d2','#388e3c','#f57c00','#7b1fa2','#c62828','#00838f','#4527a0'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }  
}

import { Component as NgComponent, Inject as NgInject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgComponent({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirmar acción</h2>
    <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cerrar(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="cerrar(true)">Eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDialogComponent>,
    @NgInject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cerrar(resultado: boolean): void {
    this.ref.close(resultado)
  }
}