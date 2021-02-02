const request = require("supertest");
const Task = require('../src/models/task')
const app = require('../src/app')
const { userOne, userTwo, setupDatabase, taskOne } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create a task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBeFalsy()
})

test("Should return only tasks of userOne", async () => {
    const response = await request(app)
        .get(`/tasks`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(201)

    expect(response.body.length).toBe(2)
})

test("UserTwo should not be able to delete any others users tasks", async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)

    expect(task).not.toBeNull()
})