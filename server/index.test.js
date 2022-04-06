const request = require('supertest');
const app = require('./index');

const TEST_USERNAME = "test";
const TEST_PASSWORD = "test10005";

let AUTH_TOKEN = null;

const genFakeEmail = () => {
    var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    var email = "";
    for(var i = 0; i < 10; i++) {
        email += chars[Math.floor(Math.random() * chars.length)];
    }
    return email + "@test.com";
};

describe('Login API', () => {
    it('should login', () => {
        return request(app)
            .post('/api/auth/login')
            .send({
                'username': TEST_USERNAME,
                'password': TEST_PASSWORD 
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                        auth_token: expect.any(String)
                })
                AUTH_TOKEN = res.body.auth_token;
            })
    });

    it('should fail to login with invalid credentials', () => {
        return request(app)
            .post('/api/auth/login')
            .send({
                'username': TEST_USERNAME,
                'password': 'invalid'
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual({
                    error: expect.any(String)
                })
            })
    });

    it('should fail to login with invalid username', () => {
        return request(app)
            .post('/api/auth/login')
            .send({
                'username': 'invalid',
                'password': TEST_PASSWORD
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toEqual({
                    error: expect.any(String)
                })
            })
    });

    it('should be able to retrieve user with token', () => {
        return request(app)
            .get(`/api/user/get?auth_token=${AUTH_TOKEN}`)
            .expect('Content-Type', /json/) 
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    username: TEST_USERNAME,
                    email: expect.any(String),
                    created: expect.any(String),
                    isAdmin: expect.any(Boolean)
                })
            })
    });
});

describe("User API", () => {
    
    var TEMP_TOKEN = null;

    it("should be able to create user", () => {
        return request(app)
            .post("/api/user/create")
            .send({
                username: 'test3',
                password: 'test30005',
                email: genFakeEmail()
            })   
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    auth_token: expect.any(String)
                })
                TEMP_TOKEN = res.body.auth_token;
            })
    });

    it("should be able to delete user", () => {
        return request(app)
            .post("/api/user/delete")
            .set('auth_token', TEMP_TOKEN)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    success: expect.any(String)
                })
            })
    });

    it("should be able to update user", () => {
        return request(app)
            .post("/api/user/update")
            .set('auth_token', AUTH_TOKEN)
            .send({
                email: genFakeEmail()
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    success: expect.any(String)
                })   
            })
        })
});

describe("Ticket API", () => {
    let createdTicketId = null;
    let winningNumbers = null;

    it("should be able to get latest numbers", () => {
        return request(app)
            .get("/api/ticket/latest")
            .set('auth_token', AUTH_TOKEN)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    mainNumbers: expect.any(Array),
                    luckyStars: expect.any(Array)
                });

                winningNumbers = res.body.mainNumbers.concat(res.body.luckyStars);
                console.log(winningNumbers);
            });
    })

    it("should be able to create ticket", () => {
        return request(app)
            .post("/api/ticket/create")
            .set('auth_token', AUTH_TOKEN)
            .send({
                users: [],
                numbers: winningNumbers,
                expires: Date.now()
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ticket_id: expect.any(String)
                });
                createdTicketId = res.body.ticket_id;
            })
    });

    it("should be able to check details on ticket", () => {
        return request(app)
            .get(`/api/ticket/get?ticket_id=${createdTicketId}`)
            .set('auth_token', AUTH_TOKEN)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    ticket_id: createdTicketId,
                    numbers: winningNumbers,
                    expiry: expect.any(String),
                    users: expect.any(Array),
                    purchased: expect.any(String)
                })
            })
    });

    it("should be able to check ticket", () => {
        return request(app)
            .get(`/api/ticket/check?ticket_id=${createdTicketId}`)
            .set('auth_token', AUTH_TOKEN)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    winning: true,
                    winnings: 'JACKPOT',
                    winningMainNumbers: 5,
                    winningLuckyStars: 2
                });
            });
            
    });

    it("should be able to delete a ticket", () => {
        return request(app)
            .post("/api/ticket/delete")
            .set('auth_token', AUTH_TOKEN)
            .send({
                ticket_id: createdTicketId
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    success: expect.any(String)
                })
            })
    });

});
