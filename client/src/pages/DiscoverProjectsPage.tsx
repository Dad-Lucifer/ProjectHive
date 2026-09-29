import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { Filter } from 'lucide-react';

export function DiscoverProjectsPage() {
  const { currentUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, category, difficulty, status, sort]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    category: category || undefined,
    difficulty: difficulty || undefined,
    status: status || undefined,
    sort: sort || undefined,
    page,
    limit: 12,
  });

  const projects = data?.items ?? [];

  return (
    <div className="flex gap-6">
      {/* Filters sidebar */}
      <aside className="w-56 flex-shrink-0">
        <div className="sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-slate" />
            <span className="text-xs font-medium text-slate uppercase tracking-wide">Filters</span>
          </div>
          <ProjectFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
            categories={categories ?? []}
            showBestMatch={!!currentUser}
          />
        </div>
      </aside>

      {/* Project grid */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={debouncedSearch || category || difficulty
              ? 'Try adjusting your filters.'
              : 'No projects are available right now. Check back soon.'}
          />
        ) : (
          <>
            <p className="text-xs text-slate">
              {data?.total ?? 0} projects found
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} showMatch={!!currentUser} />
              ))}
            </div>
            {data && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
