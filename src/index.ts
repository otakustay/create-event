export type EventHandler<E, R> = (event: E) => R;

export type EventListener<E> = <R>(handler: EventHandler<E, R>) => EventListener<R>;

export type EventTrigger<E> = (event: E) => void;

export type EventResult<E> = [EventListener<E>, EventTrigger<E>];

function createListener<E>(add: (handler: EventHandler<E, unknown>) => void): EventListener<E> {
    const listener = <R>(handler: EventHandler<E, R>): EventListener<R> => {
        add(handler);

        const nextAdd = (nextHandler: EventHandler<R, unknown>) => {
            add(event => nextHandler(handler(event)));
        };
        return createListener(nextAdd);
    };

    return listener;
}

export function createEvent<E>(): EventResult<E> {
    const handlers = new Set<EventHandler<E, unknown>>();
    const listener = createListener<E>(handler => handlers.add(handler));
    const trigger = (event: E) => {
        for (const handler of handlers) {
            handler(event);
        }
    };
    return [listener, trigger];
}
