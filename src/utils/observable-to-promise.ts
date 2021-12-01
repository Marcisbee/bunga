import { lastValueFrom, Observable, Subject } from 'rxjs';

export function observableToPromise<T = unknown>(
  observable: Observable<T> | Subject<T>,
): Promise<T> {
  if (observable instanceof Subject) {
    return new Promise((resolve) => {
      observable.subscribe(resolve).unsubscribe();
    });
  }

  return lastValueFrom(observable);
}
