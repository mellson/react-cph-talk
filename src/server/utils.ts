const randomNumberInInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const snooze = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const didThisError = () => Math.random() < 0.55; //15% probability of getting true

export const waitAndMaybeThrowError = async (
  min: number,
  max: number,
  errorMessage: string,
) => {
  await snooze(randomNumberInInterval(min, max));
  if (didThisError()) throw new Error(errorMessage);
};

export const isErrorWithMessage = (
  error: unknown,
): error is {
  message: string;
} =>
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof (error as Record<string, unknown>)['message'] === 'string';
