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
  
  // 18th Avenue Library - Floor 1
  { id: '18th-1F-001', building: '18th Avenue Library', floor: 1, status: 'available' },
  { id: '18th-1F-002', building: '18th Avenue Library', floor: 1, status: 'available' },
  { id: '18th-1F-003', building: '18th Avenue Library', floor: 1, status: 'occupied', occupant: 'Emma Wilson', occupiedAt: new Date(Date.now() - 3300000) },
  { id: '18th-1F-004', building: '18th Avenue Library', floor: 1, status: 'available' },
  { id: '18th-1F-005', building: '18th Avenue Library', floor: 1, status: 'available' },
  { id: '18th-1F-006', building: '18th Avenue Library', floor: 1, status: 'occupied', occupant: 'Lucas Brown', occupiedAt: new Date(Date.now() - 4200000) },
  
  // 18th Avenue Library - Floor 2
  { id: '18th-2F-001', building: '18th Avenue Library', floor: 2, status: 'available' },
  { id: '18th-2F-002', building: '18th Avenue Library', floor: 2, status: 'available' },
  { id: '18th-2F-003', building: '18th Avenue Library', floor: 2, status: 'available' },
  { id: '18th-2F-004', building: '18th Avenue Library', floor: 2, status: 'occupied', occupant: 'Olivia Martinez', occupiedAt: new Date(Date.now() - 5500000) },
  { id: '18th-2F-005', building: '18th Avenue Library', floor: 2, status: 'available' },
  
  // 18th Avenue Library - Floor 3
  { id: '18th-3F-001', building: '18th Avenue Library', floor: 3, status: 'available' },
  { id: '18th-3F-002', building: '18th Avenue Library', floor: 3, status: 'available' },
  { id: '18th-3F-003', building: '18th Avenue Library', floor: 3, status: 'occupied', occupant: 'Noah Davis', occupiedAt: new Date(Date.now() - 2800000) },
  { id: '18th-3F-004', building: '18th Avenue Library', floor: 3, status: 'available' },
  
  // Architecture Library - Floor 1
  { id: 'Arch-1F-001', building: 'Architecture Library', floor: 1, status: 'available' },
  { id: 'Arch-1F-002', building: 'Architecture Library', floor: 1, status: 'available' },
  { id: 'Arch-1F-003', building: 'Architecture Library', floor: 1, status: 'occupied', occupant: 'Sophia Anderson', occupiedAt: new Date(Date.now() - 3900000) },
  { id: 'Arch-1F-004', building: 'Architecture Library', floor: 1, status: 'available' },
  { id: 'Arch-1F-005', building: 'Architecture Library', floor: 1, status: 'available' },
  { id: 'Arch-1F-006', building: 'Architecture Library', floor: 1, status: 'occupied', occupant: 'Liam Thomas', occupiedAt: new Date(Date.now() - 4700000) },
  
  // Architecture Library - Floor 2
  { id: 'Arch-2F-001', building: 'Architecture Library', floor: 2, status: 'available' },
  { id: 'Arch-2F-002', building: 'Architecture Library', floor: 2, status: 'available' },
  { id: 'Arch-2F-003', building: 'Architecture Library', floor: 2, status: 'occupied', occupant: 'Isabella Clark', occupiedAt: new Date(Date.now() - 3100000) },
  { id: 'Arch-2F-004', building: 'Architecture Library', floor: 2, status: 'available' },
  { id: 'Arch-2F-005', building: 'Architecture Library', floor: 2, status: 'available' },
  
  // Architecture Library - Floor 3
  { id: 'Arch-3F-001', building: 'Architecture Library', floor: 3, status: 'available' },
  { id: 'Arch-3F-002', building: 'Architecture Library', floor: 3, status: 'available' },
  { id: 'Arch-3F-003', building: 'Architecture Library', floor: 3, status: 'available' },
  { id: 'Arch-3F-004', building: 'Architecture Library', floor: 3, status: 'occupied', occupant: 'Mason Lewis', occupiedAt: new Date(Date.now() - 2600000) },
  
  // Fine Arts Library - Floor 1
  { id: 'Arts-1F-001', building: 'Fine Arts Library', floor: 1, status: 'available' },
  { id: 'Arts-1F-002', building: 'Fine Arts Library', floor: 1, status: 'available' },
  { id: 'Arts-1F-003', building: 'Fine Arts Library', floor: 1, status: 'occupied', occupant: 'Ava Jackson', occupiedAt: new Date(Date.now() - 2100000) },
  { id: 'Arts-1F-004', building: 'Fine Arts Library', floor: 1, status: 'available' },
  { id: 'Arts-1F-005', building: 'Fine Arts Library', floor: 1, status: 'available' },
  { id: 'Arts-1F-006', building: 'Fine Arts Library', floor: 1, status: 'occupied', occupant: 'Ethan White', occupiedAt: new Date(Date.now() - 5800000) },
  
  // Fine Arts Library - Floor 2
  { id: 'Arts-2F-001', building: 'Fine Arts Library', floor: 2, status: 'available' },
  { id: 'Arts-2F-002', building: 'Fine Arts Library', floor: 2, status: 'available' },
  { id: 'Arts-2F-003', building: 'Fine Arts Library', floor: 2, status: 'occupied', occupant: 'Mia Walker', occupiedAt: new Date(Date.now() - 4100000) },
  { id: 'Arts-2F-004', building: 'Fine Arts Library', floor: 2, status: 'available' },
  { id: 'Arts-2F-005', building: 'Fine Arts Library', floor: 2, status: 'available' },
  
  // Fine Arts Library - Floor 3
  { id: 'Arts-3F-001', building: 'Fine Arts Library', floor: 3, status: 'available' },
  { id: 'Arts-3F-002', building: 'Fine Arts Library', floor: 3, status: 'available' },
  { id: 'Arts-3F-003', building: 'Fine Arts Library', floor: 3, status: 'available' },
  { id: 'Arts-3F-004', building: 'Fine Arts Library', floor: 3, status: 'occupied', occupant: 'Charlotte Hall', occupiedAt: new Date(Date.now() - 3400000) },
];
