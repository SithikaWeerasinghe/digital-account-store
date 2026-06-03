import { Product, GuaranteeOption } from '@/types/product';

/**
 * Generate default guarantee options based on product price.
 * Used for products that don't have guarantee_options defined.
 */
export function getDefaultGuaranteeOptions(basePrice: number): GuaranteeOption[] {
  return [
    {
      id: 'default-1m',
      label: '1 Month',
      months: 1,
      total_price: Number(basePrice.toFixed(2)),
      monthly_price: Number(basePrice.toFixed(2)),
      is_default: true,
    },
    {
      id: 'default-3m',
      label: '3 Months',
      months: 3,
      total_price: Number((basePrice * 3 * 0.95).toFixed(2)),
      monthly_price: Number((basePrice * 0.95).toFixed(2)),
    },
    {
      id: 'default-1y',
      label: '1 Year',
      months: 12,
      total_price: Number((basePrice * 12 * 0.85).toFixed(2)),
      monthly_price: Number((basePrice * 0.85).toFixed(2)),
      badge: 'Best Value',
    },
    {
      id: 'default-2y',
      label: '2 Years',
      months: 24,
      total_price: Number((basePrice * 24 * 0.80).toFixed(2)),
      monthly_price: Number((basePrice * 0.80).toFixed(2)),
    },
  ];
}

/**
 * Enrich a product with guarantee options if not already present.
 * Products without guarantee_options get smart defaults based on price.
 */
export function enrichProductWithGuarantees(product: Product): Product {
  if (product.guarantee_options && product.guarantee_options.length > 0) {
    return product;
  }

  const basePrice = product.price;
  return {
    ...product,
    guarantee_options: getDefaultGuaranteeOptions(basePrice),
  };
}

/**
 * Get the selected guarantee option, or the default.
 */
export function getSelectedGuarantee(
  guaranteeOptions: GuaranteeOption[] | undefined,
  selectedId?: string
): GuaranteeOption | null {
  if (!guaranteeOptions || guaranteeOptions.length === 0) return null;

  if (selectedId) {
    const selected = guaranteeOptions.find((g) => g.id === selectedId);
    if (selected) return selected;
  }

  // Return the default guarantee (marked with is_default: true)
  const defaultGuarantee = guaranteeOptions.find((g) => g.is_default);
  return defaultGuarantee || guaranteeOptions[0];
}

/**
 * Calculate total price based on selected option and guarantee.
 */
export function calculateTotalPrice(
  optionPrice: number | undefined,
  guaranteeOption: GuaranteeOption | null | undefined
): number {
  if (!optionPrice) return 0;
  if (!guaranteeOption) return optionPrice;

  return guaranteeOption.total_price;
}
