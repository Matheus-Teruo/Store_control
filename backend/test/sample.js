const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../src/server");

chai.use(chaiHttp);
chai.should();

describe("API /healthz", () => {
  it("it should return 200", done => {
    chai
      .request(app)
      .get("/healthz")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("API /", () => {
  it("it should return Welcome message", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.to.be.html;
        res.text.should.be.equal("Hello Docker World\n");
        done();
      });
  });
});

describe("API /db", () => {
  it("it should return all tables", done => {
    chai
      .request(app)
      .get("/db")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.to.be.html;
        done();
      });
  });
});

describe("API /signup", () => {
  it("it should return a success sign up", done => {
    chai
      .request(app)
      .post("/signup")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});