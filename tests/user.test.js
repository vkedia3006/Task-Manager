const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db")


beforeEach(setupDatabase)

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Mike",
      email: "Mike30@gmail.com",
      password: "MyPass777!",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: { name: "Mike", email: "mike30@gmail.com"},
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('MyPass777!')
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
});

test("Should not login non-exitent users", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "not@exist.com", password: userOne.password })
    .expect(400);
});

test("Should not login with wrong credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: "userOne.password" })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
});

test("Should delete not account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", "")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/philly.jpg")
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))

})

test("Should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Colt"
    })
    .expect(200)

    const user = await User.findById(userOneId)

    expect({ name: response.body.name }).toMatchObject({name: response.body.name})
})

test("Should not update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Waterloo"
    })
    .expect(400)
})