export type EventHandler<E, R> = (event: E) => R;

export interface EventListener<E> {
    (): void;
    <R>(handler: EventHandler<E, R>): EventListener<R>;
}

export type EventTrigger<E> = (event: E) => void;

export type EventResult<E> = [on: EventListener<E>, emit: EventTrigger<E>];

interface EventHandlerSource<E> {
    attach: (handler: EventHandler<E, unknown>) => () => void;
    detach: () => void;
}

function createListener<E>({attach, detach}: EventHandlerSource<E>): EventListener<E> {
    function listener(): void;
    function listener<R>(handler: EventHandler<E, R>): EventListener<R>;
    function listener<R>(handler?: EventHandler<E, R>) {
        if (!handler) {
            detach();
            return;
        }

        const nextDetach = attach(handler);
        const nextAttach = (nextHandler: EventHandler<R, unknown>) => attach(event => nextHandler(handler(event)));
        const nextSource: EventHandlerSource<R> = {attach: nextAttach, detach: nextDetach};
        return createListener(nextSource);
    }

    return listener;
}

export function createEvent<E>(): EventResult<E> {
    const handlers = new Set<EventHandler<E, unknown>>();
    const source: EventHandlerSource<E> = {
        attach: handler => {
            handlers.add(handler);
            return () => handlers.delete(handler);
        },
        detach: () => {},
    };
    const listener = createListener<E>(source);
    const trigger = (event: E) => {
        for (const handler of handlers) {
            handler(event);
        }
    };
    return [listener, trigger];
}
