package com.storecontrol.backend.models.volunteers;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "functions")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class Function {

  @Id @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Column(name = "function_name", nullable = false)
  private String functionName;

  @OneToMany(mappedBy = "function", fetch = FetchType.LAZY)
  private List<Voluntary> volunteers;

  @Column(nullable = false)
  private boolean valid;


  public Function(String name) {
    this.functionName = name;
    this.valid = true;
  }

  public void delete() {
    this.valid = false;
  }

  public void deleteFunction() {
    this.valid = false;
  }
}
