package com.storecontrol.backend.models.volunteers;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "functions")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@NoArgsConstructor
@AllArgsConstructor
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

  public void updateFunctionName(String functionName) {
    this.functionName = functionName;
  }

  public void deleteFunction() {
    this.valid = false;
  }
}
