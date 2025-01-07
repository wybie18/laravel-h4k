import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});
    
    const emit = (name, data) => {
        if (events[name]) {
            for (let cb of events[name]) {
                cb(data);
            }
        }
    };

    const subscribe = (name, callback) => {
        if(!events[name]) {
            events[name] = [];
        }
        events[name].push(callback);

        return () => {
            events[name] = events[name].filter(cb => cb !== callback);
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, subscribe }}>
            {children}
        </EventBusContext.Provider>
    );
}

export const useEventBus = () => {
    return React.useContext(EventBusContext);
}