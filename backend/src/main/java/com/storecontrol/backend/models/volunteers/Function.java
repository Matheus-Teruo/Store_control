package com.storecontrol.backend.models.volunteers;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Random;
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
    this.functionName = this.functionName + "_deleted_" + generateRandomString();
    this.valid = false;
  }

  private String generateRandomString() {
    String chars = "abcdefghijklmnopqrstuvwxyz";
    StringBuilder sb = new StringBuilder();
    Random random = new Random();

    for (int i = 0; i < 3; i++) {
      sb.append(chars.charAt(random.nextInt(chars.length())));
    }

    return sb.toString();
  }
}
