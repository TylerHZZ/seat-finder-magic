import { Seat } from '@/types/seat';

export const mockSeats: Seat[] = [
  // Thompson Library - Floor 1 (Ground Floor with East Atrium)
  { id: 'Thompson-1F-001', building: 'Thompson Library', floor: 1, status: 'available' },
  { id: 'Thompson-1F-002', building: 'Thompson Library', floor: 1, status: 'occupied', occupant: 'Alex Chen', occupiedAt: new Date(Date.now() - 2400000) },
  { id: 'Thompson-1F-003', building: 'Thompson Library', floor: 1, status: 'available' },
  { id: 'Thompson-1F-004', building: 'Thompson Library', floor: 1, status: 'available' },
  { id: 'Thompson-1F-005', building: 'Thompson Library', floor: 1, status: 'occupied', occupant: 'Maya Patel', occupiedAt: new Date(Date.now() - 4800000) },
  { id: 'Thompson-1F-006', building: 'Thompson Library', floor: 1, status: 'available' },
  { id: 'Thompson-1F-007', building: 'Thompson Library', floor: 1, status: 'available' },
  { id: 'Thompson-1F-008', building: 'Thompson Library', floor: 1, status: 'occupied', occupant: 'James Lee', occupiedAt: new Date(Date.now() - 6600000) },
  
  // Thompson Library - Floor 2 (Buckeye & Grand Reading Room)
  { id: 'Thompson-2F-001', building: 'Thompson Library', floor: 2, status: 'available' },
  { id: 'Thompson-2F-002', building: 'Thompson Library', floor: 2, status: 'available' },
  { id: 'Thompson-2F-003', building: 'Thompson Library', floor: 2, status: 'occupied', occupant: 'Sofia Garcia', occupiedAt: new Date(Date.now() - 3200000) },
  { id: 'Thompson-2F-004', building: 'Thompson Library', floor: 2, status: 'available' },
  { id: 'Thompson-2F-005', building: 'Thompson Library', floor: 2, status: 'available' },
  { id: 'Thompson-2F-006', building: 'Thompson Library', floor: 2, status: 'occupied', occupant: 'Ryan Taylor', occupiedAt: new Date(Date.now() - 5100000) },
  { id: 'Thompson-2F-007', building: 'Thompson Library', floor: 2, status: 'available' },
  { id: 'Thompson-2F-008', building: 'Thompson Library', floor: 2, status: 'available' },
  
  // Thompson Library - Floor 3 (Study Spaces around Tower)
  { id: 'Thompson-3F-001', building: 'Thompson Library', floor: 3, status: 'available' },
  { id: 'Thompson-3F-002', building: 'Thompson Library', floor: 3, status: 'occupied', occupant: 'John Doe', occupiedAt: new Date(Date.now() - 3600000) },
  { id: 'Thompson-3F-003', building: 'Thompson Library', floor: 3, status: 'available' },
  { id: 'Thompson-3F-004', building: 'Thompson Library', floor: 3, status: 'available' },
  { id: 'Thompson-3F-005', building: 'Thompson Library', floor: 3, status: 'occupied', occupant: 'Jane Smith', occupiedAt: new Date(Date.now() - 5400000) },
  { id: 'Thompson-3F-006', building: 'Thompson Library', floor: 3, status: 'available' },
  { id: 'Thompson-3F-007', building: 'Thompson Library', floor: 3, status: 'available' },
  { id: 'Thompson-3F-008', building: 'Thompson Library', floor: 3, status: 'occupied', occupant: 'Mike Johnson', occupiedAt: new Date(Date.now() - 7200000) },
  
  // Thompson Library - Floor 4 (Quiet Study with Roof Terrace)
  { id: 'Thompson-4F-001', building: 'Thompson Library', floor: 4, status: 'available' },
  { id: 'Thompson-4F-002', building: 'Thompson Library', floor: 4, status: 'available' },
  { id: 'Thompson-4F-003', building: 'Thompson Library', floor: 4, status: 'available' },
  { id: 'Thompson-4F-004', building: 'Thompson Library', floor: 4, status: 'occupied', occupant: 'Sarah Williams', occupiedAt: new Date(Date.now() - 1800000) },
  
  // Union
  { id: 'Union-2F-001', building: 'Union', floor: 2, status: 'available' },
  { id: 'Union-2F-002', building: 'Union', floor: 2, status: 'available' },
  { id: 'Union-2F-003', building: 'Union', floor: 2, status: 'occupied', occupant: 'David Brown', occupiedAt: new Date(Date.now() - 4500000) },
  { id: 'Union-2F-004', building: 'Union', floor: 2, status: 'available' },
  
  // SEL
  { id: 'SEL-1F-001', building: 'SEL', floor: 1, status: 'available' },
  { id: 'SEL-1F-002', building: 'SEL', floor: 1, status: 'available' },
  { id: 'SEL-1F-003', building: 'SEL', floor: 1, status: 'available' },
  { id: 'SEL-2F-001', building: 'SEL', floor: 2, status: 'occupied', occupant: 'Emily Davis', occupiedAt: new Date(Date.now() - 6300000) },
];
