import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getApiUrl } from '../config/api.config';

export interface Material {
  MatCode: string;
  MatName: string;
  MatQty: number;
  MatPrice: number;
  user_id?: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MatMstService {
  private apiUrl = `${getApiUrl()}/matmst`;
  constructor(private http: HttpClient) {}

  // Read
  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  // Create
  createMaterial(material: Material): Observable<any> {
    return this.http.post(this.apiUrl, material);
  }
  // Create Bulk
  createBulkMaterials(materials: Material[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, materials);
  }
  // Update
  updateMaterial(material: Material): Observable<any> {
    return this.http.put(`${this.apiUrl}/${material.MatCode}`, material);
  }

  // Delete
  deleteMaterial(matCode: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matCode}`);
  }
}
