export function getErrorMessage(err, fallback = "Error") {
  const response = err?.response?.data ?? err?.data ?? {};
  const errors = response?.errors;
  const message = response?.msg ?? response?.message ?? err?.message;

  const errorMessage =
    errors?.non_field ??
    errors?.title ??
    errors?.content ??
    errors?.description ??
    errors?.username ??
    errors?.password ??
    Object.values(errors ?? {})
      .filter(Boolean)
      .join(", ");

  return errorMessage || message || fallback;
}
