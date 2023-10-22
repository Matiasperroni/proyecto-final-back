import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");


//para este test cambiar los datos para crear un usuario distinto
describe.only("Testing sessions.",() => {
    const user = {
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        age: 30,
        password: "asd123"
    }
    it("User should register.", async() => {
        
        const registeredUser = await requester.post("/sessions/register").send(user);
        expect(registeredUser.status).to.equal(200)
        expect(registeredUser.body).to.not.be.empty
    })

    it("User should login with the same credentials as before.", async () => {
        const userLogged = await requester.post("/sessions/login").send(user)
        expect(userLogged.ok).to.equal(true)
        expect(userLogged.body.payload.first_name).to.equal(user.first_name)
        expect(userLogged.body.payload.email).to.equal(user.email)
        expect(userLogged.body.payload.role).to.equal("Premium")
        console.log("log",userLogged.body.payload);
    })

    it("GET request to /current should render user info.", async () => {
        const userCurrent = await requester.get("/current")
        console.log("current", userCurrent.header);
        expect(userCurrent.text).to.not.be.empty
        expect(userCurrent.status).to.equal(200)
        expect(userCurrent.header).to.deep.include({'content-type': 'text/html; charset=utf-8'})
    })
})