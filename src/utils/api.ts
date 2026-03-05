export async function getDataFromAPI<T>(
  url: string,
  signal: AbortSignal,
  params?: Record<string, string | number>
): Promise<T[]> {
  const fullUrl = new URL(url);

  if (params) {
    fullUrl.search = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, value.toString()])
      )
    ).toString();
  }

  try {
    const response = await fetch(fullUrl, { signal });
    if (!response.ok) {
      console.warn(`HTTP ошибка: ${response.status} ${response.statusText}`);
      return [];
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn("Запрос отменен");
    } else {
      console.warn(`Сетевая ошибка: ${error.message}`);
    }
    return []; // возвращаем пустой массив при сетевой ошибке
  }
}
