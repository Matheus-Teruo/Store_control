import styles from "./About.module.scss";
import entityRelationship from "./../../../../../entity_relationship_diagram.png";
import useCaseDiagram from "./../../../../../use_case_diagram.png";
import useCaseEventTypesDiagram from "./../../../../../use_case_event_types_diagram.png";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.header}>
        <h1>About Sales Monitoring Project</h1>
        <p>
          An advanced web service for managing sales and inventory in charity
          events.
        </p>
        <p className={styles.note}>
          note: this section still in English for portfolio reasons, but in the
          future the site will have an option to change the language
        </p>
      </header>

      <section className={styles.section}>
        <h2>Overview</h2>
        <p>
          This web service is designed to assist in managing sales control for
          charity events. It provides a digital platform to formalize sales,
          track statistics, manage inventory, and handle volunteers' permissions
          based on their roles.
        </p>
        <p>
          The system was designed to accommodate three different types of
          events, allowing flexibility based on specific event needs. The
          selection of the event type occurs when initializing the system.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Technical Details</h2>
        <p>
          The system is based on an <strong>Entity-Relationship Diagram</strong>
          , which serves as the foundation for database design. The database is
          implemented using an <strong>ORM (Object-Relational Mapping)</strong>
          framework to ensure seamless integration between the application and
          database.
        </p>
        <div className={styles.imagePlaceholder}>
          <img src={entityRelationship} alt="entity relationship diagram" />
        </div>

        <h3>Use Case Diagrams</h3>
        <p>
          The backend is modeled using multiple{" "}
          <strong>Use Case Diagrams</strong> that define user interactions and
          different system functionalities.
        </p>
        <div className={styles.imagePlaceholder}>
          <img src={useCaseDiagram} alt="use case diagram" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Supported Event Types</h2>
        <p>The system is designed to support three different event models:</p>

        <div className={styles.eventType}>
          <h3>1. Basic Mode</h3>
          <p>
            In this mode, a single cashier is responsible for processing sales,
            collecting payments, and delivering orders. This model is ideal for
            small events where all responsibilities are unified.
          </p>
        </div>

        <div className={styles.eventType}>
          <h3>2. Order Card Mode (e.g., Festival do Japão)</h3>
          <p>
            - The cashier takes the order, processes the payment, and issues a
            QR-coded card to the customer.
            <br />
            - The customer takes the card to a designated pickup area, where
            volunteers scan the card and fulfill the order.
            <br />- This method speeds up order processing by splitting
            responsibilities.
          </p>
        </div>

        <div className={styles.eventType}>
          <h3>3. Token-Based Mode (e.g., Festa Junina)</h3>
          <p>
            - The cashier sells tokens (event currency) to customers.
            <br />
            - Customers use these tokens at different stands to purchase food or
            goods.
            <br />
            - Each stand deducts the appropriate number of tokens from the
            customer's balance upon purchase.
            <br />- This allows large-scale events to manage multiple sales
            points efficiently.
          </p>
        </div>

        <div className={styles.imagePlaceholder}>
          <img
            src={useCaseEventTypesDiagram}
            alt="use case diagram for types of event"
          />
        </div>
      </section>
    </div>
  );
}

export default About;
