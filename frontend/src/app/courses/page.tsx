'use client';

import { useI18n } from '@/i18n';
import { Course, coursesAPI } from '@/lib/api';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { ErrorBoundary, ErrorFallback, CourseListSkeleton } from '@/components/ui';

export default function CoursesPage() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coursesAPI.getAll();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    load();
    return () => {
      mounted = false;
    };
  }, [load]);

  const filteredCourses = courses.filter((course) => {
    const haystack =
      `${course.title} ${course.description || ''} ${course.instructor}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const countLabel = t('courses.page.count_available')
    .replace('{count}', String(filteredCourses.length))
    .replace('{plural}', filteredCourses.length === 1 ? '' : 's');

  return (
    <ErrorBoundary>
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8" aria-busy={loading}>
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <span className="eyebrow">{t('courses.page.eyebrow')}</span>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-5xl">
            {t('courses.page.title')}
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
            {t('courses.page.description')}
          </p>
          <div className="surface-card p-6">
            <p className="text-sm leading-7 text-[var(--muted)]">
              {t('courses.page.focus')}
            </p>
          </div>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <label
            htmlFor="course-search"
            className="mb-3 block text-sm font-medium text-[var(--text-strong)]"
          >
            {t('courses.page.search_label')}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              id="course-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('courses.page.search_placeholder')}
              className="w-full rounded-2xl border border-white/12 bg-white/5 px-11 py-3.5 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)]"
            />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {loading ? t('courses.page.loading') : countLabel}
          </p>
        </div>
      </section>

      {loading && <CourseListSkeleton />}

      {error && !loading && (
        <div className="mt-10">
          <ErrorFallback message={error} onRetry={load} variant="card" />
        </div>
      )}

      {!loading && !error && (
        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="surface-card group flex h-full flex-col justify-between p-6 transition hover:translate-y-[-2px] hover:border-[rgba(240,100,45,0.35)]"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-[var(--brand-strong)]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/6 px-3 py-1 text-xs font-medium text-[var(--text-strong)]">
                    {t('courses.page.credits').replace('{credits}', String(course.credits))}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[var(--text-strong)]">
                  {course.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {course.description || t('courses.page.description_fallback')}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    {t('courses.page.instructor')}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-strong)]">
                    {course.instructor}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
                  {t('courses.page.open')}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}

        {!loading && filteredCourses.length === 0 && (
          <div className="surface-card col-span-full p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--text-strong)]">{t('courses.page.no_results_title')}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t('courses.page.no_results_description')}
            </p>
          </div>
        )}
      </section>
    </div>
    </ErrorBoundary>
  );
}
