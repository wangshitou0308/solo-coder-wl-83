export interface Room {
  id: string;
  name: string;
  floor: string;
}

export type WallMaterial = '水泥砂浆' | '石膏板' | '硅藻泥' | '护墙板' | '其他';

export type IssueType = '裂缝' | '钉眼' | '空鼓' | '起皮' | '霉斑' | '污渍';

export type PhotoType = '现状' | '色卡' | '修补前' | '修补后';

export interface Photo {
  id: string;
  wallId: string;
  url: string;
  type: PhotoType;
  date: string;
  description?: string;
}

export interface Wall {
  id: string;
  roomId: string;
  name: string;
  material: WallMaterial;
  primerBrand: string;
  primerColor: string;
  topcoatBrand: string;
  topcoatColor: string;
  topcoatHex?: string;
  constructionDate: string;
  contractor: string;
  notes?: string;
  photos: Photo[];
}

export interface Repair {
  id: string;
  wallId: string;
  date: string;
  location: string;
  issueType: IssueType;
  materials: string;
  steps: string;
  isRecurring?: boolean;
}

export interface PaintInventory {
  id: string;
  brand: string;
  colorCode: string;
  colorName: string;
  hexColor: string;
  openDate: string;
  location: string;
  remainingAmount: number;
  unit: 'L' | 'ml' | 'kg';
}

export const ISSUE_COLORS: Record<IssueType, string> = {
  '裂缝': '#C75B39',
  '钉眼': '#B89968',
  '空鼓': '#7A8B6F',
  '起皮': '#4D6E73',
  '霉斑': '#3A5A5F',
  '污渍': '#6B8C90',
};

export const MATERIAL_LIST: WallMaterial[] = ['水泥砂浆', '石膏板', '硅藻泥', '护墙板', '其他'];

export const ISSUE_LIST: IssueType[] = ['裂缝', '钉眼', '空鼓', '起皮', '霉斑', '污渍'];

export const PHOTO_TYPE_LIST: PhotoType[] = ['现状', '色卡', '修补前', '修补后'];
