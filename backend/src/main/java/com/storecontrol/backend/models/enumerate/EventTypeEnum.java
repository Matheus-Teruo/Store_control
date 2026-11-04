package com.storecontrol.backend.models.enumerate;

public enum EventTypeEnum {
    SIMPLE("simple"),
    ORDER("order"),
    TOKEN("token");

    private final String eventTypeEnumLower;

    EventTypeEnum(String eventTypeEnumLower) {
        this.eventTypeEnumLower = eventTypeEnumLower;
    }

    public static EventTypeEnum fromString(String type) {
        for(EventTypeEnum eventTypeEnum : EventTypeEnum.values()) {
            if (eventTypeEnum.eventTypeEnumLower.equalsIgnoreCase(type)){
                return eventTypeEnum;
            }
        }
        throw new IllegalArgumentException("No event status found from the passed String");
    }
}
