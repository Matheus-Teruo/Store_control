package com.storecontrol.backend.services.customers;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.customers.Card;
import com.storecontrol.backend.models.customers.request.RequestCard;
import com.storecontrol.backend.repositories.customers.CardRepository;
import com.storecontrol.backend.services.customers.component.CardValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CardService {

  @Autowired
  private CardValidation validation;

  @Autowired
  private CardRepository repository;

  @Transactional
  public Card createCard(RequestCard request) {
    validation.checkNameDuplication(request.cardId());
    var card = new Card(request);
    repository.save(card);

    return card;
  }

  public Card takeCardById(String cardId) {
    return repository.findById(cardId)
        .orElseThrow(EntityNotFoundException::new);
  }

  public Card safeTakeCardById(String cardId) {
    return repository.findById(cardId)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.card.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.card.get.validation.message"),
            cardId)
        );
  }

  public Page<Card> pageAllCards(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Page<Card> pageActiveCards(Pageable pageable) {
    return repository.findAllActiveTrue(pageable);
  }
}
