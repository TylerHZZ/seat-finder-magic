export interface Seat {
  id: string;
  building: string;
  floor: number;
  status: 'available' | 'occupied';
  occupant?: string;
  occupiedAt?: Date;
}

export type Building = 'Thompson Library' | 'Union' | 'SEL' | 'Science & Engineering Library';
