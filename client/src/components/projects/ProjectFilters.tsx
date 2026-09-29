import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import type { Category } from '../../types/category';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  categories: Category[];
  showBestMatch?: boolean;
}

export function ProjectFilters({
  search, onSearchChange, category, onCategoryChange,
  difficulty, onDifficultyChange, status, onStatusChange,
  sort, onSortChange, categories, showBestMatch,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        id="project-search"
        placeholder="Search projects…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="filter-category"
          label="Category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c._id, label: c.name }))}
        />
        <Select
          id="filter-difficulty"
          label="Difficulty"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          placeholder="Any difficulty"
          options={[
            { value: 'BEGINNER', label: 'Beginner' },
            { value: 'INTERMEDIATE', label: 'Intermediate' },
            { value: 'ADVANCED', label: 'Advanced' },
            { value: 'EXPERT', label: 'Expert' },
          ]}
        />
        <Select
          id="filter-status"
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          placeholder="Any status"
          options={[
            { value: 'OPEN', label: 'Open' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
          ]}
        />
        <Select
          id="filter-sort"
          label="Sort by"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'members', label: 'Most Members' },
            ...(showBestMatch ? [{ value: 'match', label: 'Best Match' }] : []),
          ]}
        />
      </div>
    </div>
  );
}
