export interface Seat {
  id: string;
  building: string;
  floor: number;
  status: 'available' | 'occupied';
  occupant?: string;
  occupiedAt?: Date;
}

export type Building = 'Thompson Library' | '18th Avenue Library' | 'Architecture Library' | 'Fine Arts Library';
