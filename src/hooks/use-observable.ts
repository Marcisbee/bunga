import React from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(source$: Observable<T>): T | null {
  const [output, setOutput] = React.useState<T | null>(null);

  React.useLayoutEffect(() => {
    if (!source$) {
      return;
    }

    const subscriber = source$.subscribe(setOutput);

    return () => {
      subscriber.unsubscribe();
    };
  }, [source$]);

  return output;
}
