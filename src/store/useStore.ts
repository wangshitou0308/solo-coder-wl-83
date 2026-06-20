import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Room, Wall, Repair, PaintInventory, Photo } from '@/types';
import { mockRooms, mockWalls, mockRepairs, mockInventory } from '@/utils/mockData';
import { generateId } from '@/utils/dateUtils';

interface WallState {
  rooms: Room[];
  walls: Wall[];
  repairs: Repair[];
  inventory: PaintInventory[];

  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  addWall: (wall: Omit<Wall, 'id' | 'photos'>) => void;
  updateWall: (id: string, data: Partial<Wall>) => void;
  deleteWall: (id: string) => void;

  addPhoto: (wallId: string, photo: Omit<Photo, 'id' | 'wallId'>) => void;
  deletePhoto: (wallId: string, photoId: string) => void;

  addRepair: (repair: Omit<Repair, 'id'>) => void;
  updateRepair: (id: string, data: Partial<Repair>) => void;
  deleteRepair: (id: string) => void;

  addPaint: (paint: Omit<PaintInventory, 'id'>) => void;
  updatePaint: (id: string, data: Partial<PaintInventory>) => void;
  deletePaint: (id: string) => void;

  getWallsByRoom: (roomId: string) => Wall[];
  getRepairsByWall: (wallId: string) => Repair[];
  getRecurringIssues: () => Repair[];
  searchInventory: (query: string) => PaintInventory[];
  getWallById: (id: string) => Wall | undefined;
  getRoomById: (id: string) => Room | undefined;
}

export const useStore = create<WallState>()(
  persist(
    (set, get) => ({
      rooms: mockRooms,
      walls: mockWalls,
      repairs: mockRepairs,
      inventory: mockInventory,

      addRoom: (room) =>
        set((state) => ({
          rooms: [...state.rooms, { ...room, id: generateId() }],
        })),

      updateRoom: (id, data) =>
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),

      deleteRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== id),
          walls: state.walls.filter((w) => w.roomId !== id),
        })),

      addWall: (wall) =>
        set((state) => ({
          walls: [...state.walls, { ...wall, id: generateId(), photos: [] }],
        })),

      updateWall: (id, data) =>
        set((state) => ({
          walls: state.walls.map((w) => (w.id === id ? { ...w, ...data } : w)),
        })),

      deleteWall: (id) =>
        set((state) => ({
          walls: state.walls.filter((w) => w.id !== id),
          repairs: state.repairs.filter((r) => r.wallId !== id),
        })),

      addPhoto: (wallId, photo) =>
        set((state) => ({
          walls: state.walls.map((w) =>
            w.id === wallId
              ? { ...w, photos: [...w.photos, { ...photo, id: generateId(), wallId }] }
              : w
          ),
        })),

      deletePhoto: (wallId, photoId) =>
        set((state) => ({
          walls: state.walls.map((w) =>
            w.id === wallId ? { ...w, photos: w.photos.filter((p) => p.id !== photoId) } : w
          ),
        })),

      addRepair: (repair) => {
        const locationMap = new Map<string, number>();
        get().repairs.forEach((r) => {
          const key = `${r.wallId}-${r.location}`;
          locationMap.set(key, (locationMap.get(key) || 0) + 1);
        });
        const newKey = `${repair.wallId}-${repair.location}`;
        const isRecurring = (locationMap.get(newKey) || 0) >= 1;

        set((state) => ({
          repairs: [...state.repairs, { ...repair, id: generateId(), isRecurring }],
        }));
      },

      updateRepair: (id, data) =>
        set((state) => ({
          repairs: state.repairs.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),

      deleteRepair: (id) =>
        set((state) => ({
          repairs: state.repairs.filter((r) => r.id !== id),
        })),

      addPaint: (paint) =>
        set((state) => ({
          inventory: [...state.inventory, { ...paint, id: generateId() }],
        })),

      updatePaint: (id, data) =>
        set((state) => ({
          inventory: state.inventory.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deletePaint: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((p) => p.id !== id),
        })),

      getWallsByRoom: (roomId) => get().walls.filter((w) => w.roomId === roomId),

      getRepairsByWall: (wallId) =>
        get()
          .repairs.filter((r) => r.wallId === wallId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      getRecurringIssues: () => get().repairs.filter((r) => r.isRecurring),

      searchInventory: (query) => {
        const q = query.toLowerCase();
        return get().inventory.filter(
          (p) =>
            p.brand.toLowerCase().includes(q) ||
            p.colorCode.toLowerCase().includes(q) ||
            p.colorName.toLowerCase().includes(q)
        );
      },

      getWallById: (id) => get().walls.find((w) => w.id === id),

      getRoomById: (id) => get().rooms.find((r) => r.id === id),
    }),
    {
      name: 'wall-tracker-storage',
    }
  )
);
