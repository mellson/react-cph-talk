const randomNumberInInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const snooze = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const didThisError = () => Math.random() < 0.15; //15% probability of getting true

export const waitAndMaybeThrowError = async (min: number, max: number) => {
  await snooze(randomNumberInInterval(min, max));
  // if (didThisError()) throw new Error('Noooo 🙀 Something went wrong');
};
