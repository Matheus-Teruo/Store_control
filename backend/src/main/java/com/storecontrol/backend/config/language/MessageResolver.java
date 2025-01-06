package com.storecontrol.backend.config.language;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MessageResolver {

  @Getter
  private static MessageResolver instance;

  private final MessageSource messageSource;

  @Autowired
  public MessageResolver(MessageSource messageSource) {
    this.messageSource = messageSource;
    instance = this;
  }

  public String getMessage(String key, Object... args) {
    Locale locale = LocaleContextHolder.getLocale();
    return messageSource.getMessage(key, args, locale);
  }
}
