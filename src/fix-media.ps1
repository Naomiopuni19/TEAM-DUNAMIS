$root = "C:\Users\efyan\Downloads\Team Dunamis\TEAM-DUNAMIS"

$imageUploadField = @'
import { useState, type ChangeEvent } from 'react'

const CLOUD_NAME = 'your-cloud-name'
const UPLOAD_PRESET = 'salon_media'

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (url: string) => void
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData },
      )

      if (!response.ok) throw new Error('Upload failed, please try again.')

      const data = await response.json()
      onChange(data.secure_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#956f80]">
        {label}
      </span>

      {value && (
        <img
          src={value}
          alt=""
          className="mb-3 h-32 w-full rounded-xl object-cover border border-[#ecd8e1]"
        />
      )}

      <label className="flex h-13 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d99eb7] bg-[#fff7fa] text-sm font-semibold text-[#9f205f] hover:bg-[#fdeef4]">
        {uploading ? 'Uploading...' : value ? 'Replace photo' : 'Upload a photo'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-xs text-[#b32269]">{error}</p>}
    </div>
  )
}
'@

$servicesAdminPage = @'
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
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

[System.IO.File]::WriteAllText("$root\src\admin\components\ImageUploadField.tsx", $imageUploadField, $utf8NoBom)
Write-Host "Created ImageUploadField.tsx"

[System.IO.File]::WriteAllText("$root\src\admin\pages\ServicesAdminPage.tsx", $servicesAdminPage, $utf8NoBom)
Write-Host "Updated ServicesAdminPage.tsx"

Write-Host ""
Write-Host "Now finding ProductsAdminPage.tsx so we can do the same there..."
Get-ChildItem -Path $root -Recurse -Filter "ProductsAdminPage.tsx" | Select-Object FullName