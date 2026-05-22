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
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-root',
  imports: [
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
      this.form.reset();
      this.cdr.detectChanges();
    } else {
      this.form.markAllAsTouched();
    }
  }

  eliminar(id: number): void {
    this.empleados = this.empleados.filter(e => e.id !== id);
    this.cdr.detectChanges();
  }

  getColor(name: string): string {
    const colors = ['#1976d2','#388e3c','#f57c00','#7b1fa2','#c62828','#00838f','#4527a0'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }  
}