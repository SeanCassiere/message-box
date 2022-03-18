export function dummyPromise(value?: number) {
  return new Promise((res) => setTimeout(() => res(true), value ?? 2500));
}
