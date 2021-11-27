import deepEqual from 'fast-deep-equal';

interface PromiseCache {
  promise?: Promise<void>;
  inputs: Array<any>;
  error?: any;
  response?: any;
}

const promiseCaches: PromiseCache[] = [];

export function usePromise(
  // eslint-disable-next-line no-shadow
  promise: (...inputs: any) => any,
  inputs: Array<any>,
  lifespan = 0,
) {
  for (const promiseCache of promiseCaches) {
    if (deepEqual(inputs, promiseCache.inputs)) {
      // If an error occurred,
      if (Object.prototype.hasOwnProperty.call(promiseCache, 'error')) {
        throw promiseCache.error;
      }

      // If a response was successful,
      if (Object.prototype.hasOwnProperty.call(promiseCache, 'response')) {
        return promiseCache.response;
      }
      throw promiseCache.promise;
    }
  }

  // The request is new or has changed.
  const promiseCache: PromiseCache = {
    promise:
      // Make the promise request.
      promise(...inputs)
        .then((response: any) => {
          promiseCache.response = response;
        })
        .catch((e: any) => {
          promiseCache.error = e;
        })
        .then(() => {
          if (lifespan > 0) {
            setTimeout(() => {
              const index = promiseCaches.indexOf(promiseCache);
              if (index !== -1) {
                promiseCaches.splice(index, 1);
              }
            }, lifespan);
          }
        }),
    inputs,
  };
  promiseCaches.push(promiseCache);
  throw promiseCache.promise;
}
