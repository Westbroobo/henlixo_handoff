import { Search } from 'lucide-react';

import type { ProductFamily } from '../../types/product';

export type FamilyFilter = ProductFamily | 'All';

type CatalogFiltersProps = {
  family: FamilyFilter;
  scenario: string;
  search: string;
  onFamilyChange: (family: FamilyFilter) => void;
  onScenarioChange: (scenario: string) => void;
  onSearchChange: (search: string) => void;
};

const families: FamilyFilter[] = ['All', 'Pergola', 'Sunroom', 'Railing', 'Accessories'];
const scenarios = ['All', 'Hotel', 'Resort', 'Restaurant', 'Villa', 'Pool', 'Dealer'];

export function CatalogFilters({
  family,
  scenario,
  search,
  onFamilyChange,
  onScenarioChange,
  onSearchChange,
}: CatalogFiltersProps) {
  return (
    <div className="catalog-filters">
      <label className="search-field">
        <Search size={16} />
        <input
          placeholder="Search SKU, product, scenario or keyword"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <div className="filter-groups">
        <div className="filter-group" aria-label="Product family filter">
          {families.map((item) => (
            <button key={item} type="button" className={family === item ? 'active' : undefined} aria-pressed={family === item} onClick={() => onFamilyChange(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="filter-group" aria-label="Scenario filter">
          {scenarios.map((item) => (
            <button key={item} type="button" className={scenario === item ? 'active' : undefined} aria-pressed={scenario === item} onClick={() => onScenarioChange(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
