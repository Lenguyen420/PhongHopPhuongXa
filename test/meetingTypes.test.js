import assert from 'node:assert/strict'
import test from 'node:test'
import { formatMeetingTypeName, normalizeMeetingTypes } from '../src/services/meetingTypes.js'

test('adds Vietnamese diacritics to known meeting type names', () => {
  assert.equal(formatMeetingTypeName('Hop giao ban'), 'Họp giao ban')
  assert.equal(formatMeetingTypeName('Hop HDND'), 'Họp HĐND')
  assert.equal(formatMeetingTypeName('Hop noi bo'), 'Họp nội bộ')
  assert.equal(formatMeetingTypeName('Khan'), 'Khẩn')
  assert.equal(formatMeetingTypeName('Hop chuyen de'), 'Họp chuyên đề')
})

test('keeps custom names and normalizes the full API collection', () => {
  assert.equal(formatMeetingTypeName('Họp đột xuất'), 'Họp đột xuất')
  assert.deepEqual(
    normalizeMeetingTypes([
      { id: '1', name: 'Hop HDND' },
      { id: '2', name: 'Họp đột xuất' },
    ]),
    [
      { id: '1', name: 'Họp HĐND' },
      { id: '2', name: 'Họp đột xuất' },
    ],
  )
})
