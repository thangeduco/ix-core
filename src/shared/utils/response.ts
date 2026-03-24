export function ok(data: unknown, message = "OK") {
  return {
    success: true,
    message,
    data
  };
}
