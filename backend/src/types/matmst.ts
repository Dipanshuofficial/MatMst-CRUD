export interface MatMst {
  MatCode: string;
  MatName: string;
  MatQty: number;
  MatPrice: number;
  user_id: number;
  created_at?: Date | string; // Optional because the database auto-generates this
}
