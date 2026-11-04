package com.storecontrol.backend.models.event;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import com.storecontrol.backend.models.enumerate.EventStatus;
import com.storecontrol.backend.models.enumerate.EventTypeEnum;

@Entity
@Table(name = "events")
@Getter
@NoArgsConstructor
@AllArgsConstructor 
public class Event {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "event_name", nullable = false, unique = true)
    private String eventName;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_type", nullable = false, length = 100)
    private EventTypeEnum eventType;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PLANNING;

    @Column(nullable = false)
    private Integer valid;
}
