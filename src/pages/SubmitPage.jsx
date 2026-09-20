import { useState } from 'react'
import { CheckCircle2, Send, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories.js'
import { useApp } from '../hooks/useApp.js'
import { isValidHttpUrl } from '../utils/url.js'
import PageHeader from '../components/PageHeader.jsx'
import Tag from '../components/Tag.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

const EMPTY_FORM = {
  name: '',
  url: '',
  description: '',
  category: '',
  subcategory: '',
  tags: '',
}

export default function SubmitPage() {
  const { addSubmission, submissions, removeSubmission, notify } = useApp()
  useDocumentTitle('Submit a resource · OpenTrace')
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const selectedCategory = categories.find((c) => c.id === form.category)

  const set = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }))
    setErrors((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!isValidHttpUrl(form.url)) next.url = 'Enter a valid http(s) URL'
    if (!form.category) next.category = 'Choose a category'
    if (!form.subcategory) next.subcategory = 'Choose a subcategory'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    addSubmission({
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim() || 'Submitted by a user. Description pending.',
      category: form.category,
      subcategory: form.subcategory,
      tags: form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 6),
    })
    setForm(EMPTY_FORM)
    notify('Resource submitted locally', 'success')
  }

  return (
    <div className="mx-auto max-w-3xl animate-page-in px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Contribute"
        title="Submit a resource"
        description="Add a useful website to your personal OpenTrace directory. Submissions are stored locally and marked as pending review."
      />

      <form onSubmit={submit} className="panel space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="sub-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              Name
            </label>
            <input
              id="sub-name"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="e.g. ExampleHQ"
              className={`input-base ${errors.name ? 'border-red-400/50' : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="sub-url" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              URL
            </label>
            <input
              id="sub-url"
              value={form.url}
              onChange={(e) => set({ url: e.target.value })}
              placeholder="https://example.com"
              className={`input-base ${errors.url ? 'border-red-400/50' : ''}`}
            />
            {errors.url && <p className="mt-1 text-xs text-red-400">{errors.url}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="sub-desc" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Description
          </label>
          <textarea
            id="sub-desc"
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            placeholder="What is this website for and who is it useful to?"
            className="input-base resize-y"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value, subcategory: '' })}
              className={`input-base ${errors.category ? 'border-red-400/50' : ''}`}
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
              Subcategory
            </label>
            <select
              value={form.subcategory}
              onChange={(e) => set({ subcategory: e.target.value })}
              disabled={!selectedCategory}
              className={`input-base ${errors.subcategory ? 'border-red-400/50' : ''}`}
            >
              <option value="">
                {selectedCategory ? 'Select a subcategory…' : 'Pick a category first'}
              </option>
              {selectedCategory?.subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-xs text-red-400">{errors.subcategory}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="sub-tags" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Tags (comma separated)
          </label>
          <input
            id="sub-tags"
            value={form.tags}
            onChange={(e) => set({ tags: e.target.value })}
            placeholder="design, templates, free"
            className="input-base"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-5">
          <span className="mr-auto font-mono text-[11px] text-faint">
            Stored locally · never leaves your browser
          </span>
          <button type="submit" className="btn-primary">
            <Send size={14} /> Submit resource
          </button>
        </div>
      </form>

      {submissions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold text-ink">
            Your submissions ({submissions.length})
          </h2>
          <div className="space-y-3">
            {submissions.map((sub) => {
              const category = categories.find((c) => c.id === sub.category)
              const subcategory = category?.subcategories.find((s) => s.id === sub.subcategory)
              return (
                <div key={sub.id} className="panel flex flex-wrap items-center gap-3 p-4">
                  <CheckCircle2 size={16} className="shrink-0 text-amber-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-ink">{sub.name}</h3>
                      <span className="chip border-amber-400/40 text-amber-400">
                        Pending review
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-faint">
                      {sub.url} · {category?.name} / {subcategory?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(sub.tags || []).slice(0, 3).map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                    <Link
                      to={`/resource/${sub.id}`}
                      className="font-mono text-[11px] uppercase tracking-wider text-accent-soft hover:text-accent"
                    >
                      view
                    </Link>
                    <button
                      onClick={() => {
                        removeSubmission(sub.id)
                        notify('Submission removed')
                      }}
                      aria-label="Remove submission"
                      className="rounded p-1.5 text-faint transition-colors hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}