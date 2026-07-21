const meetingTypeNames = {
  'hop giao ban': 'Họp giao ban',
  'hop hdnd': 'Họp HĐND',
  'hop noi bo': 'Họp nội bộ',
  khan: 'Khẩn',
  'hop chuyen de': 'Họp chuyên đề',
}

function toLookupKey(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .trim()
    .toLowerCase()
}

export function formatMeetingTypeName(name) {
  if (typeof name !== 'string') return name
  return meetingTypeNames[toLookupKey(name)] ?? name
}

export function normalizeMeetingTypes(types = []) {
  return types.map((type) => ({
    ...type,
    name: formatMeetingTypeName(type.name),
  }))
}
