import MeetingFooter from '@/components/Meetings/MeetingFooter'
import MeetingForm from '@/components/Meetings/MeetingForm'
import MeetingHeader from '@/components/Meetings/MeetingHeader'
import MeetingOptions from '@/components/Meetings/MeetingOptions'
import {
  useCreateMeetingMutation,
  useFormOptionsQuery,
  useMeetingQuery,
  useUpdateMeetingMutation,
} from '@/services/meetingApi'
import { deleteAttachment, uploadAttachment } from '@/services/files'

function MeetingsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = params.get('id')
  const { data: options, isLoading: loadingOptions } = useFormOptionsQuery()
  const { data: meeting, isLoading: loadingMeeting } = useMeetingQuery(id, { skip: !id })
  const [createMeeting, { isLoading: creating }] = useCreateMeetingMutation()
  const [updateMeeting, { isLoading: updating }] = useUpdateMeetingMutation()
  const [newFiles, setNewFiles] = useState([])
  const [removedDocuments, setRemovedDocuments] = useState([])

  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const guestName = data.get('guestName')?.trim()
    const body = {
      title: data.get('title')?.trim(),
      typeId: data.get('typeId') || undefined,
      description: data.get('description')?.trim(),
      agenda: data.get('agenda')?.trim(),
      date: data.get('date'),
      startTime: data.get('startTime'),
      endTime: data.get('endTime'),
      allDay: data.has('allDay'),
      mode: data.get('meetingMode') || 'IN_PERSON',
      roomId: data.get('roomId') || undefined,
      hostId: data.get('hostId'),
      participantMode: data.get('participantsMode') || 'DEPARTMENTS',
      departmentIds: data.getAll('departmentIds'),
      guests: guestName
        ? [
            {
              name: guestName,
              unit: data.get('guestUnit'),
              email: data.get('guestEmail') || undefined,
              phone: data.get('guestPhone') || undefined,
            },
          ]
        : [],
      votingEnabled: data.has('votingEnabled'),
      recordingEnabled: data.has('recordingEnabled'),
      attendanceEnabled: data.has('attendanceEnabled'),
      attendanceMethod: data.get('attendanceType') || 'QR_CODE',
      reminderMinutes: data.getAll('reminderMinutes').map(Number),
      status: event.nativeEvent.submitter?.value || 'SCHEDULED',
    }
    try {
      const saved = id
        ? await updateMeeting({ id, body }).unwrap()
        : await createMeeting(body).unwrap()
      const failed = []
      for (const file of newFiles) {
        try {
          await uploadAttachment(file, 'meetings', saved.id)
        } catch {
          failed.push(file.name)
        }
      }
      for (const document of removedDocuments)
        await deleteAttachment(document.id).catch(() => undefined)
      if (failed.length) toast.error(`Đã lưu cuộc họp, nhưng lỗi tải: ${failed.join(', ')}`)
      else toast.success(body.status === 'DRAFT' ? 'Đã lưu nháp' : 'Đã lưu cuộc họp')
      navigate('/lich-hop')
    } catch (error) {
      toast.error(error?.data?.message || 'Không thể lưu cuộc họp')
    }
  }

  if (loadingOptions || loadingMeeting)
    return (
      <p className="rounded-[20px] bg-white p-8 text-center font-semibold">Đang tải biểu mẫu...</p>
    )
  const sampleFiles = [
    ...(meeting?.documents ?? []).filter(
      (item) => !removedDocuments.some((removed) => removed.id === item.id),
    ),
    ...newFiles,
  ]
  const busy = creating || updating
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <MeetingHeader onBack={() => navigate('/lich-hop')} />

      <form
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
        id="meeting-form"
        onSubmit={submit}
      >
        <MeetingForm
          departments={options?.departments ?? []}
          hosts={options?.hosts ?? []}
          rooms={options?.rooms ?? []}
          sampleFiles={sampleFiles}
          types={options?.types ?? []}
          meeting={meeting}
          onFilesChange={(files) => setNewFiles((current) => [...current, ...files])}
          onDeleteFile={(file) =>
            file.id
              ? setRemovedDocuments((current) => [...current, file])
              : setNewFiles((current) => current.filter((item) => item !== file))
          }
        />
        <MeetingOptions meeting={meeting} />
      </form>

      <MeetingFooter onCancel={() => navigate('/lich-hop')} />
      {busy && (
        <p className="text-center text-sm font-semibold text-blue-600">Đang lưu dữ liệu...</p>
      )}
    </div>
  )
}

export default MeetingsPage
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
