export function handleError(error: any, message?: string) {
  console.error(message || 'An error occurred:', error);
  // You can add more sophisticated error handling logic here,
  // such as sending errors to a logging service or displaying
  // a user-friendly error message.
  throw error;
}
