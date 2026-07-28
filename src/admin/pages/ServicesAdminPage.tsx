import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAppData } from '../../context/appData'
import type { Service } from '../../data/catalog'
import { api } from '../../lib/api'
import { fieldClass, Notice, PageHeader, Panel, PrimaryButton } from '../components/AdminUi'
import { ImageUploadField } from '../components/ImageUploadField'

type Category = { id: string; name: string; dailyCap: number }

export function ServicesAdminPage() {
  const { services, refreshCatalog, token } = useAppData()
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const loadCategories = useCallback(() => api.categories().then(setCategories), [])

  useEffect(() => { void loadCategories() }, [loadCategories])

  function openForm(service: Service | null) {
    setEditing(service)
    setImageUrl(service?.images[0] ?? '')
    setShowForm(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return
    const form = new FormData(event.currentTarget)
    const body = {
      name: String(form.get('name')),
      description: String(form.get('description')),
      categoryId: String(form.get('categoryId')),
      durationMinutes: Number(form.get('durationMinutes')),
      priceMin: Number(form.get('priceMin')),
      priceMax: Number(form.get('priceMax')),
      images: imageUrl ? [imageUrl] : [],
    }
    try {
      if (editing) await api.updateService(token, editing.id, body)
      else await api.createService(token, body)
      setEditing(null); setShowForm(false); setMessage('Service saved.')
      await refreshCatalog()
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Unable to save service.') }
  }

  async function remove(service: Service) {
    if (!token || !window.confirm(`Remove ${service.name}?`)) return
    try { await api.deleteService(token, service.id); await refreshCatalog(); setMessage('Service removed.') }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Unable to remove service.') }
  }

  return (
    <>
      <PageHeader eyebrow="Services" title="Salon service catalogue" description="Create, price, organize and retire bookable salon services." action={<PrimaryButton onClick={() => openForm(null)}>Add service</PrimaryButton>} />
      {message && <div className="mt-6"><Notice>{message}</Notice></div>}
      {showForm && (
        <Panel className="mt-6">
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <input name="name" required defaultValue={editing?.name} placeholder="Service name" className={fieldClass} />
            <select name="categoryId" required defaultValue={editing?.category.id} className={fieldClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <textarea name="description" required defaultValue={editing?.description} placeholder="Description" className={`${fieldClass} h-24 py-3 md:col-span-2`} />
            <input name="durationMinutes" required type="number" min="1" defaultValue={editing?.durationMinutes} placeholder="Duration in minutes" className={fieldClass} />
            <div className="md:col-span-2">
              <ImageUploadField label="Service photo" value={imageUrl} onChange={setImageUrl} />
            </div>
            <input name="priceMin" required type="number" min="0" defaultValue={editing?.priceMin} placeholder="Minimum price" className={fieldClass} />
            <input name="priceMax" required type="number" min="0" defaultValue={editing?.priceMax} placeholder="Maximum price" className={fieldClass} />
            <div className="flex gap-3 md:col-span-2"><PrimaryButton type="submit">Save service</PrimaryButton><button type="button" onClick={() => setShowForm(false)} className="text-sm">Cancel</button></div>
          </form>
        </Panel>
      )}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {services.map((service) => (
          <Panel key={service.id}>
            <div className="flex gap-4">
              <img src={service.images[0]} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl text-[#3e2530]">{service.name}</p>
                <p className="mt-1 text-xs text-[#8f7480]">{service.category.name} - {service.durationMinutes} min - GHC {service.priceMin} to {service.priceMax}</p>
                <div className="mt-4 flex gap-4 text-xs font-bold uppercase"><button onClick={() => openForm(service)} className="text-[#a52261]">Edit</button><button onClick={() => remove(service)} className="text-red-600">Delete</button></div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}