import { supabase, supabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

/**
 * Fallback list used when the categories table is missing/empty or Supabase is
 * not configured. Mirrors the migration seed so the storefront keeps working.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'default-streaming', name: 'Streaming', slug: 'streaming', icon: null, description: 'Entertainment subscriptions & media access', sort_order: 1, is_active: true, created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString() },
  { id: 'default-ai', name: 'AI Tools', slug: 'ai-tools', icon: null, description: 'AI assistants, writing & design tools', sort_order: 2, is_active: true, created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString() },
  { id: 'default-gaming', name: 'Gaming', slug: 'gaming', icon: null, description: 'In-game items, bundles & game passes', sort_order: 3, is_active: true, created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString() },
  { id: 'default-software', name: 'Software', slug: 'software', icon: null, description: 'License keys for essential software', sort_order: 4, is_active: true, created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString() },
  { id: 'default-productivity', name: 'Productivity', slug: 'productivity', icon: null, description: 'Cloud storage, learning & work tools', sort_order: 5, is_active: true, created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString() },
];

/** Admin: all categories ordered by sort_order. Falls back to defaults. */
export async function getCategories(): Promise<Category[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return DEFAULT_CATEGORIES;
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) {
    if (error) console.error('[categoryService] getCategories failed:', error.message);
    return DEFAULT_CATEGORIES;
  }
  return data as Category[];
}

/** Public: active categories only, ordered by sort_order. Falls back to defaults. */
export async function getActiveCategories(): Promise<Category[]> {
  const all = await getCategories();
  return all.filter((c) => c.is_active !== false);
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
  if (!input.name?.trim()) throw new Error('Category name is required');

  const slug = (input.slug?.trim() || slugify(input.name)) || `category-${Date.now()}`;
  const row = {
    name: input.name.trim(),
    slug,
    icon: input.icon ?? null,
    description: input.description ?? null,
    sort_order: input.sort_order ?? 0,
    is_active: input.is_active ?? true,
  };

  const { data, error } = await supabaseAdmin.from('categories').insert(row).select().single();
  if (error || !data) {
    if (error?.code === '23505') throw new Error('A category with this slug already exists');
    throw new Error(error?.message || 'Failed to create category');
  }
  return data as Category;
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const patch: Record<string, any> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.slug !== undefined) patch.slug = input.slug || slugify(input.name || '') || undefined;
  if (input.icon !== undefined) patch.icon = input.icon;
  if (input.description !== undefined) patch.description = input.description;
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order;
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (Object.keys(patch).length === 0) throw new Error('No fields to update');

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) {
    if (error?.code === '23505') throw new Error('A category with this slug already exists');
    throw new Error(error?.message || 'Failed to update category');
  }
  return data as Category;
}
