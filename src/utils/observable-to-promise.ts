import { lastValueFrom, Observable, Subject } from 'rxjs';

export function observableToPromise(observable: Observable<any> | Subject<any>) {
  if (observable instanceof Subject) {
    return new Promise((resolve) => {
      observable.subscribe(resolve).unsubscribe();
    });
  }

  return lastValueFrom(observable);
}
