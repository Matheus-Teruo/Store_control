package com.storecontrol.backend.models.enumerate;

public enum EventStatus {
    PLANNING("planning"),
    ACTIVE("active"),
    FINISHED("finished");

    private final String eventStatusLower;

    EventStatus(String eventStatusLower) {
        this.eventStatusLower = eventStatusLower;
    }

    public static EventStatus fromString(String type) {
        for(EventStatus eventStatus : EventStatus.values()) {
            if (eventStatus.eventStatusLower.equalsIgnoreCase(type)){
                return eventStatus;
            }
        }
        throw new IllegalArgumentException("No event status found from the passed String");
    }
}
