import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from "@angular/material/tooltip";

interface Empleado {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterLink, MatTooltip],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {
  empleado: Empleado | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (isPlatformBrowser(this.platformId) && id) {
      this.http.get<Empleado>(`https://jsonplaceholder.typicode.com/users/${id}`)
        .subscribe(data => {
          this.empleado = data;
          this.cargando = false;
          this.cdr.detectChanges();
        });
    }
  }

  getColor(name: string): string {
    const colors = ['#1976d2','#388e3c','#f57c00','#7b1fa2','#c62828','#00838f','#4527a0'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}