import { useLayoutEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(source$: Observable<T>): T | null {
  const [output, setOutput] = useState<T | null>(null);

  useLayoutEffect(() => {
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
