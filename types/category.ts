export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}
