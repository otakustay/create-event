# create-event

This is a simple event library originated from [solid-events](https://github.com/devagrawal09/solid-events), I feel the idea of `solid-events` is great, so I transformed it to a framework free implementation.

## Usage

### Simple Event

```tsx
import {createEvent} from '@otakustay/create-event';

const [onEvent, emitEvent] = createEvent<string>();

onEvent(value => console.log(value));
trigger('Hello World'); // Hello World
```

### Derived Listener

Listener function will return another listener function which allows a handler receiving a "tranformed" value.

```tsx
import {createEvent} from '@otakustay/create-event';

const [onCount, emitCount] = createEvent<number>();

// Transform a count value to an incremented value
const onNextCount = onCount(count => count + 1);

onNextCount(value => console.log(`Next value: ${value}`));
emitCount(1); // Next value: 2
```
