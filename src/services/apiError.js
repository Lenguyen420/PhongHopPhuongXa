export const getApiErrorMessage = (error, fallback) => {
  const message = error?.data?.message
  if (Array.isArray(message)) return message.join(', ')
  return typeof message === 'string' && message ? message : fallback
}
